import { categorizeAqi, categoryRank } from "./aqi";
import type {
  AirQualitySnapshot,
  BestWindow,
  CommuteMode,
  DeterministicPlan,
  ImpactEstimate,
  IndoorHack,
  LifestyleInput,
  RiskAssessment,
  RoutineRecommendation,
  SustainableSwap,
} from "./types";

const COMMUTE_EMISSION_KG_CO2_PER_KM: Record<CommuteMode, number> = {
  walk_cycle: 0,
  two_wheeler: 0.07,
  car_solo: 0.19,
  car_pool: 0.1,
  public_transport: 0.04,
  work_from_home: 0,
};

const ASSUMED_COMMUTE_KM_PER_DAY = 12;
const ASSUMED_COMMUTE_DAYS_PER_WEEK = 5;

function buildRiskAssessments(
  input: LifestyleInput,
  category: ReturnType<typeof categorizeAqi>
): RiskAssessment[] {
  const rank = categoryRank(category.category);
  const assessments: RiskAssessment[] = [];

  const baseRisk = (sensitiveBoost: number): RiskAssessment["riskLevel"] => {
    const effectiveRank = rank + sensitiveBoost;
    if (effectiveRank <= 0) return "low";
    if (effectiveRank <= 1) return "moderate";
    if (effectiveRank <= 3) return "high";
    return "severe";
  };

  if (input.household.adults > 0) {
    assessments.push({
      memberLabel: "Adults (no conditions)",
      count: input.household.adults,
      riskLevel: baseRisk(0),
      note: "General population guidance applies.",
    });
  }
  if (input.household.children > 0) {
    assessments.push({
      memberLabel: "Children",
      count: input.household.children,
      riskLevel: baseRisk(1),
      note: "Developing lungs mean children absorb more pollutants per breath; limit vigorous outdoor play when AQI is elevated.",
    });
  }
  if (input.household.elderly > 0) {
    assessments.push({
      memberLabel: "Elderly",
      count: input.household.elderly,
      riskLevel: baseRisk(1),
      note: "Higher risk of cardiovascular and respiratory strain; monitor for breathlessness or fatigue.",
    });
  }
  if (input.household.hasRespiratoryCondition) {
    assessments.push({
      memberLabel: "Member(s) with respiratory/cardiac condition",
      count: 1,
      riskLevel: baseRisk(2),
      note: "Keep rescue medication accessible; avoid outdoor exertion entirely above Unhealthy levels.",
    });
  }
  if (input.household.hasPregnantMember) {
    assessments.push({
      memberLabel: "Pregnant member(s)",
      count: 1,
      riskLevel: baseRisk(1),
      note: "Reduce outdoor exposure time; prioritize indoor air filtration.",
    });
  }

  return assessments;
}

function buildBestWindows(airQuality: AirQualitySnapshot): BestWindow[] {
  const points = airQuality.hourly.filter((p) => typeof p.usAqi === "number");
  if (points.length === 0) return [];

  const sorted = [...points].sort((a, b) => (a.usAqi ?? 0) - (b.usAqi ?? 0));
  const best = sorted.slice(0, 3);

  return best.map((point) => ({
    startTime: point.time,
    endTime: point.time,
    usAqi: point.usAqi ?? 0,
  }));
}

function buildRoutines(
  input: LifestyleInput,
  rank: number
): RoutineRecommendation[] {
  const routines: RoutineRecommendation[] = [];

  if (rank >= 2) {
    routines.push({
      title: "Move outdoor exercise indoors",
      detail: `At today's air quality, ${input.activityLevel === "active" ? "vigorous" : "moderate"} outdoor exercise is discouraged. Swap your routine for a home workout, stairs, or an indoor gym session.`,
      priority: "high",
    });
  } else if (input.activityLevel === "active") {
    routines.push({
      title: "Keep outdoor training, but time it well",
      detail: "Air quality supports outdoor activity today — schedule intense sessions around the cleanest hours shown in your forecast.",
      priority: "medium",
    });
  }

  if (rank >= 1) {
    routines.push({
      title: "Shift outdoor hours to the cleanest window",
      detail: `You reported ~${input.outdoorHoursPerDay}h outdoors/day. Concentrate that time in the lowest-AQI window below rather than spreading it across the day.`,
      priority: rank >= 3 ? "high" : "medium",
    });
  }

  if (rank >= 2 && !input.hasAirPurifier) {
    routines.push({
      title: "Seal up during peak pollution hours",
      detail: "Keep windows and doors closed during the day's worst hours, and only ventilate during your cleanest window to flush indoor air.",
      priority: "high",
    });
  }

  if (input.household.children > 0 && rank >= 1) {
    routines.push({
      title: "Reschedule children's outdoor play",
      detail: "Move school pick-up walks, playground time, or sports practice to the cleanest hours identified for today.",
      priority: rank >= 2 ? "high" : "medium",
    });
  }

  if (routines.length === 0) {
    routines.push({
      title: "Maintain your normal routine",
      detail: "Air quality is favorable today — no schedule changes needed. Good time for outdoor errands, exercise, or play.",
      priority: "low",
    });
  }

  return routines;
}

function buildIndoorHacks(input: LifestyleInput, rank: number): IndoorHack[] {
  const hacks: IndoorHack[] = [];

  if (!input.hasAirPurifier && rank >= 1) {
    hacks.push({
      title: "Build a box-fan filter",
      detail: "Strap a MERV-13 furnace filter to a box fan facing inward — a low-cost HEPA-equivalent purifier for one room in under 10 minutes.",
    });
  }
  if (input.hasAirPurifier) {
    hacks.push({
      title: "Run your purifier on auto, not low",
      detail: "Keep the purifier on 'auto' mode during peak-pollution hours so it ramps up automatically rather than idling on a low fixed setting.",
    });
  }
  hacks.push({
    title: "Target kitchen and bathroom exhaust",
    detail: "Run exhaust fans while cooking or showering — indoor combustion and steam particulates add to your baseline exposure regardless of outdoor AQI.",
  });
  if (rank >= 2) {
    hacks.push({
      title: "Damp-dust and vacuum with a sealed-bag vacuum",
      detail: "Settled outdoor particulates re-enter the air when disturbed. Damp-dust surfaces and use a vacuum with a sealed bag/HEPA filter twice a week during high-AQI spells.",
    });
  }
  hacks.push({
    title: "Add 2-3 air-filtering houseplants",
    detail: "Snake plant, areca palm, and money plant modestly improve indoor air and are low-maintenance for most households.",
  });

  return hacks;
}

function buildSustainableSwaps(
  input: LifestyleInput,
  rank: number
): SustainableSwap[] {
  const swaps: SustainableSwap[] = [];
  const currentEmission = COMMUTE_EMISSION_KG_CO2_PER_KM[input.commute];

  const addSwap = (
    mode: CommuteMode,
    title: string,
    detail: string
  ) => {
    const newEmission = COMMUTE_EMISSION_KG_CO2_PER_KM[mode];
    const weeklyKm = ASSUMED_COMMUTE_KM_PER_DAY * ASSUMED_COMMUTE_DAYS_PER_WEEK;
    const co2ReductionKgPerWeek = Math.max(
      0,
      (currentEmission - newEmission) * weeklyKm
    );
    const pm25ExposureReductionPct =
      mode === "walk_cycle" || mode === "public_transport" ? 15 : 8;

    if (co2ReductionKgPerWeek > 0) {
      swaps.push({
        title,
        detail,
        pm25ExposureReductionPct,
        co2ReductionKgPerWeek: Math.round(co2ReductionKgPerWeek * 10) / 10,
      });
    }
  };

  if (input.commute === "car_solo") {
    addSwap(
      "car_pool",
      "Carpool for your commute",
      "Sharing your commute with one other rider roughly halves your per-trip emissions."
    );
    addSwap(
      "public_transport",
      "Switch to public transport",
      "Buses and metro move far more people per unit of emissions than a solo car trip."
    );
    if (rank === 0) {
      addSwap(
        "walk_cycle",
        "Walk or cycle short legs of your trip",
        "If part of your commute is under 3km, walking or cycling that stretch removes emissions entirely — best on good-AQI days."
      );
    }
  } else if (input.commute === "two_wheeler") {
    addSwap(
      "public_transport",
      "Try public transport a few days a week",
      "Even swapping 2 days/week from two-wheeler to bus/metro meaningfully reduces your weekly footprint."
    );
  }

  return swaps;
}

function buildImpact(
  input: LifestyleInput,
  rank: number,
  swaps: SustainableSwap[],
  routinesApplied: boolean
): ImpactEstimate {
  const baselineExposureIndex = (rank + 1) * input.outdoorHoursPerDay * 7;
  const routineReductionPct = routinesApplied ? 20 : 0;
  const swapReductionPct =
    swaps.length > 0
      ? Math.min(25, Math.max(...swaps.map((s) => s.pm25ExposureReductionPct)))
      : 0;
  const totalReductionPct = Math.min(60, routineReductionPct + swapReductionPct);

  const improvedExposureIndex =
    baselineExposureIndex * (1 - totalReductionPct / 100);

  const co2ReductionKgPerWeek = swaps.reduce(
    (sum, s) => sum + s.co2ReductionKgPerWeek,
    0
  );

  return {
    currentWeeklyPm25ExposureIndex: Math.round(baselineExposureIndex),
    improvedWeeklyPm25ExposureIndex: Math.round(improvedExposureIndex),
    exposureReductionPct: totalReductionPct,
    co2ReductionKgPerWeek: Math.round(co2ReductionKgPerWeek * 10) / 10,
    assumptionsNote:
      "Exposure index is a relative, illustrative score (not a medical measurement) derived from today's AQI tier and your reported outdoor hours. CO2 figures assume a 12km/day, 5-day/week commute using standard per-km emission factors by transport mode.",
  };
}

export function buildDeterministicPlan(
  input: LifestyleInput,
  airQuality: AirQualitySnapshot
): DeterministicPlan {
  const categoryInfo = categorizeAqi(airQuality.usAqi);
  const rank = categoryRank(categoryInfo.category);

  const riskAssessments = buildRiskAssessments(input, categoryInfo);
  const bestWindows = buildBestWindows(airQuality);
  const routines = buildRoutines(input, rank);
  const indoorHacks = buildIndoorHacks(input, rank);
  const sustainableSwaps = buildSustainableSwaps(input, rank);
  const impact = buildImpact(
    input,
    rank,
    sustainableSwaps,
    routines.some((r) => r.priority === "high")
  );

  return {
    categoryInfo,
    riskAssessments,
    bestWindows,
    routines,
    indoorHacks,
    sustainableSwaps,
    impact,
  };
}
