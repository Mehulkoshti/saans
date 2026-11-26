import type { ImpactEstimate } from "@/lib/types";

interface ImpactSectionProps {
  impact: ImpactEstimate;
}

export function ImpactSection({ impact }: ImpactSectionProps) {
  return (
    <section
      aria-labelledby="impact-heading"
      className="rounded-2xl border border-border bg-surface-muted p-6 sm:p-8"
    >
      <h3 id="impact-heading" className="font-semibold text-lg">
        Your estimated weekly impact
      </h3>
      <div className="mt-4 grid sm:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-foreground/60">Exposure index now</p>
          <p className="text-2xl font-bold">{impact.currentWeeklyPm25ExposureIndex}</p>
        </div>
        <div>
          <p className="text-sm text-foreground/60">Exposure index with plan</p>
          <p className="text-2xl font-bold text-aqi-good">
            {impact.improvedWeeklyPm25ExposureIndex}
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground/60">CO2 reduced / week</p>
          <p className="text-2xl font-bold text-aqi-good">{impact.co2ReductionKgPerWeek} kg</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-foreground/60">{impact.assumptionsNote}</p>
    </section>
  );
}
