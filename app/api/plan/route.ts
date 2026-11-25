import { NextRequest, NextResponse } from "next/server";
import { fetchAirQuality, geocodeCity } from "@/lib/aqi";
import { generateNarrative } from "@/lib/ai";
import { buildDeterministicPlan } from "@/lib/planner";
import { isRateLimited } from "@/lib/rateLimit";
import { lifestyleInputSchema } from "@/lib/validation";
import type { AssistantPlan } from "@/lib/types";

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = lifestyleInputSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;

  const location = await geocodeCity(input.cityQuery);
  if (!location) {
    return NextResponse.json(
      { error: `Couldn't find a location matching "${input.cityQuery}". Try a more specific city name.` },
      { status: 404 }
    );
  }

  const airQuality = await fetchAirQuality(location);
  if (!airQuality) {
    return NextResponse.json(
      { error: "Air quality data is temporarily unavailable for this location. Please try again shortly." },
      { status: 502 }
    );
  }

  const plan = buildDeterministicPlan(input, airQuality);

  const narrative = await generateNarrative({
    input,
    airQuality: {
      usAqi: airQuality.usAqi,
      pollutants: airQuality.pollutants,
      observedAt: airQuality.observedAt,
      locationName: `${location.name}${location.admin1 ? ", " + location.admin1 : ""}, ${location.country}`,
    },
    plan,
  });

  const result: AssistantPlan = {
    input,
    airQuality,
    plan,
    aiEnhanced: narrative !== null,
    aiNarrative: narrative,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(result);
}
