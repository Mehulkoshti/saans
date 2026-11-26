"use client";

import { AqiGauge } from "@/components/AqiGauge";
import { PollutantBreakdown } from "@/components/PollutantBreakdown";
import type { AssistantPlan } from "@/lib/types";
import { BestWindowsSection } from "./results/BestWindowsSection";
import { formatHour } from "./results/formatHour";
import { ImpactSection } from "./results/ImpactSection";
import { IndoorHacksSection } from "./results/IndoorHacksSection";
import { NarrativeSection } from "./results/NarrativeSection";
import { RiskSection } from "./results/RiskSection";
import { RoutinesSection } from "./results/RoutinesSection";
import { SwapsSection } from "./results/SwapsSection";

interface ResultsViewProps {
  result: AssistantPlan;
  onStartOver: () => void;
}

export function ResultsView({ result, onStartOver }: ResultsViewProps) {
  const { airQuality, plan } = result;
  const locationLabel = `${airQuality.location.name}${
    airQuality.location.admin1 ? ", " + airQuality.location.admin1 : ""
  }, ${airQuality.location.country}`;

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold">{locationLabel}</h2>
          <p className="text-sm text-foreground/60">
            Live reading as of{" "}
            {formatHour(airQuality.observedAt, airQuality.location.timezone)}
          </p>
        </div>
        <button
          onClick={onStartOver}
          className="self-start rounded-full border border-border px-5 py-2 text-sm font-semibold transition hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Check another city
        </button>
      </div>

      <section
        aria-labelledby="aqi-heading"
        className="rounded-2xl border border-border bg-surface p-6 sm:p-8 grid sm:grid-cols-2 gap-8 items-center"
      >
        <h3 id="aqi-heading" className="sr-only">
          Current air quality
        </h3>
        <AqiGauge
          usAqi={airQuality.usAqi}
          categoryInfo={plan.categoryInfo}
          locationLabel={locationLabel}
        />
        <PollutantBreakdown pollutants={airQuality.pollutants} />
      </section>

      <NarrativeSection narrative={result.aiNarrative} categoryInfo={plan.categoryInfo} />
      <RiskSection riskAssessments={plan.riskAssessments} />
      <BestWindowsSection
        bestWindows={plan.bestWindows}
        timezone={airQuality.location.timezone}
      />
      <RoutinesSection routines={plan.routines} />
      <IndoorHacksSection indoorHacks={plan.indoorHacks} />
      <SwapsSection swaps={plan.sustainableSwaps} />
      <ImpactSection impact={plan.impact} />
    </div>
  );
}
