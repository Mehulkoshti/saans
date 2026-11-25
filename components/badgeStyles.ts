export const RISK_BADGE_STYLES: Record<
  "low" | "moderate" | "high" | "severe",
  string
> = {
  low: "bg-aqi-good/10 text-aqi-good border-aqi-good/30",
  moderate: "bg-aqi-moderate/10 text-aqi-moderate border-aqi-moderate/30",
  high: "bg-aqi-sensitive/10 text-aqi-sensitive border-aqi-sensitive/30",
  severe: "bg-aqi-unhealthy/10 text-aqi-unhealthy border-aqi-unhealthy/30",
};

export const PRIORITY_BADGE_STYLES: Record<"high" | "medium" | "low", string> = {
  high: "bg-aqi-unhealthy/10 text-aqi-unhealthy border-aqi-unhealthy/30",
  medium: "bg-aqi-moderate/10 text-aqi-moderate border-aqi-moderate/30",
  low: "bg-aqi-good/10 text-aqi-good border-aqi-good/30",
};
