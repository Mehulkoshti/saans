import "server-only";
import type {
  AirQualitySnapshot,
  AqiCategory,
  AqiCategoryInfo,
  GeocodeResult,
  HourlyForecastPoint,
} from "./types";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const REQUEST_TIMEOUT_MS = 8_000;

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timeout);
  }
}

export async function geocodeCity(query: string): Promise<GeocodeResult | null> {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) return null;

  const data = await response.json();
  const first = data?.results?.[0];
  if (!first) return null;

  return {
    name: first.name,
    admin1: first.admin1,
    country: first.country,
    latitude: first.latitude,
    longitude: first.longitude,
    timezone: first.timezone,
  };
}

export async function fetchAirQuality(
  location: GeocodeResult
): Promise<AirQualitySnapshot | null> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "us_aqi,pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,ozone,carbon_monoxide",
    hourly: "us_aqi",
    timezone: location.timezone || "auto",
    forecast_days: "2",
  });
  const url = `${AIR_QUALITY_URL}?${params.toString()}`;

  const response = await fetchWithTimeout(url);
  if (!response.ok) return null;

  const data = await response.json();
  const current = data?.current;
  if (!current || typeof current.us_aqi !== "number") return null;

  const hourlyTimes: string[] = data?.hourly?.time ?? [];
  const hourlyAqi: (number | null)[] = data?.hourly?.us_aqi ?? [];

  const currentHourStart = new Date(current.time);
  currentHourStart.setMinutes(0, 0, 0);
  const nowIndex = hourlyTimes.findIndex(
    (t) => new Date(t).getTime() >= currentHourStart.getTime()
  );
  const startIndex = nowIndex >= 0 ? nowIndex : 0;

  const hourly: HourlyForecastPoint[] = hourlyTimes
    .slice(startIndex, startIndex + 24)
    .map((time, i) => ({
      time,
      usAqi: hourlyAqi[startIndex + i] ?? null,
    }));

  return {
    location,
    observedAt: current.time,
    usAqi: Math.round(current.us_aqi),
    pollutants: {
      pm2_5: current.pm2_5 ?? null,
      pm10: current.pm10 ?? null,
      no2: current.nitrogen_dioxide ?? null,
      so2: current.sulphur_dioxide ?? null,
      o3: current.ozone ?? null,
      co: current.carbon_monoxide ?? null,
    },
    hourly,
  };
}

const CATEGORY_TABLE: Array<{ max: number; info: AqiCategoryInfo }> = [
  {
    max: 50,
    info: {
      category: "good",
      label: "Good",
      colorToken: "aqi-good",
      guidance: "Air quality is satisfactory for everyone.",
    },
  },
  {
    max: 100,
    info: {
      category: "moderate",
      label: "Moderate",
      colorToken: "aqi-moderate",
      guidance: "Acceptable, but unusually sensitive people should watch for symptoms.",
    },
  },
  {
    max: 150,
    info: {
      category: "unhealthy_sensitive",
      label: "Unhealthy for Sensitive Groups",
      colorToken: "aqi-sensitive",
      guidance: "Children, elderly, and those with respiratory or heart conditions should reduce prolonged outdoor exertion.",
    },
  },
  {
    max: 200,
    info: {
      category: "unhealthy",
      label: "Unhealthy",
      colorToken: "aqi-unhealthy",
      guidance: "Everyone may begin to experience health effects; sensitive groups may experience more serious effects.",
    },
  },
  {
    max: 300,
    info: {
      category: "very_unhealthy",
      label: "Very Unhealthy",
      colorToken: "aqi-very-unhealthy",
      guidance: "Health alert: everyone may experience more serious health effects.",
    },
  },
  {
    max: Infinity,
    info: {
      category: "hazardous",
      label: "Hazardous",
      colorToken: "aqi-hazardous",
      guidance: "Health emergency: the entire population is likely to be affected.",
    },
  },
];

export function categorizeAqi(usAqi: number): AqiCategoryInfo {
  const match = CATEGORY_TABLE.find((entry) => usAqi <= entry.max);
  return match ? match.info : CATEGORY_TABLE[CATEGORY_TABLE.length - 1].info;
}

export function categoryRank(category: AqiCategory): number {
  return CATEGORY_TABLE.findIndex((entry) => entry.info.category === category);
}
