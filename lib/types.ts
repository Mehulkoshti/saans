export type CommuteMode =
  | "walk_cycle"
  | "two_wheeler"
  | "car_solo"
  | "car_pool"
  | "public_transport"
  | "work_from_home";

export type ActivityLevel = "sedentary" | "moderate" | "active";

export interface HouseholdProfile {
  adults: number;
  children: number;
  elderly: number;
  hasRespiratoryCondition: boolean;
  hasPregnantMember: boolean;
}

export interface LifestyleInput {
  cityQuery: string;
  household: HouseholdProfile;
  commute: CommuteMode;
  outdoorHoursPerDay: number;
  hasAirPurifier: boolean;
  activityLevel: ActivityLevel;
}

export interface GeocodeResult {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PollutantReading {
  pm2_5: number | null;
  pm10: number | null;
  no2: number | null;
  so2: number | null;
  o3: number | null;
  co: number | null;
}

export interface HourlyForecastPoint {
  time: string;
  usAqi: number | null;
}

export interface AirQualitySnapshot {
  location: GeocodeResult;
  observedAt: string;
  usAqi: number;
  pollutants: PollutantReading;
  hourly: HourlyForecastPoint[];
}

export type AqiCategory =
  | "good"
  | "moderate"
  | "unhealthy_sensitive"
  | "unhealthy"
  | "very_unhealthy"
  | "hazardous";

export interface AqiCategoryInfo {
  category: AqiCategory;
  label: string;
  colorToken: string;
  guidance: string;
}

export interface RiskAssessment {
  memberLabel: string;
  count: number;
  riskLevel: "low" | "moderate" | "high" | "severe";
  note: string;
}

export interface BestWindow {
  startTime: string;
  endTime: string;
  usAqi: number;
}

export interface RoutineRecommendation {
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
}

export interface IndoorHack {
  title: string;
  detail: string;
}

export interface SustainableSwap {
  title: string;
  detail: string;
  pm25ExposureReductionPct: number;
  co2ReductionKgPerWeek: number;
}

export interface ImpactEstimate {
  currentWeeklyPm25ExposureIndex: number;
  improvedWeeklyPm25ExposureIndex: number;
  exposureReductionPct: number;
  co2ReductionKgPerWeek: number;
  assumptionsNote: string;
}

export interface DeterministicPlan {
  categoryInfo: AqiCategoryInfo;
  riskAssessments: RiskAssessment[];
  bestWindows: BestWindow[];
  routines: RoutineRecommendation[];
  indoorHacks: IndoorHack[];
  sustainableSwaps: SustainableSwap[];
  impact: ImpactEstimate;
}

export interface AssistantPlan {
  input: LifestyleInput;
  airQuality: AirQualitySnapshot;
  plan: DeterministicPlan;
  aiEnhanced: boolean;
  aiNarrative: string | null;
  generatedAt: string;
}
