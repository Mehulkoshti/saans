"use client";

import { Clock, Leaf, Sparkles } from "lucide-react";
import { AqiGauge } from "@/components/AqiGauge";
import { PollutantBreakdown } from "@/components/PollutantBreakdown";
import { PRIORITY_BADGE_STYLES, RISK_BADGE_STYLES } from "@/components/badgeStyles";
import type { AssistantPlan } from "@/lib/types";

interface ResultsViewProps {
  result: AssistantPlan;
  onStartOver: () => void;
}

function formatHour(iso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
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

      {result.aiNarrative ? (
        <section
          aria-labelledby="narrative-heading"
          className="rounded-2xl border border-brand/30 bg-brand/5 p-6 sm:p-8"
        >
          <h3
            id="narrative-heading"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <Sparkles className="h-5 w-5 text-brand" aria-hidden="true" />
            Your personalized summary
          </h3>
          <p className="mt-3 whitespace-pre-line text-foreground/90 leading-relaxed">
            {result.aiNarrative}
          </p>
        </section>
      ) : (
        <section
          aria-labelledby="narrative-fallback-heading"
          className="rounded-2xl border border-border bg-surface-muted p-6 sm:p-8"
        >
          <h3 id="narrative-fallback-heading" className="font-semibold text-lg">
            Your plan at a glance
          </h3>
          <p className="mt-2 text-sm text-foreground/70">
            {plan.categoryInfo.label} air quality right now. Here is your complete,
            rule-based routine below.
          </p>
        </section>
      )}

      {plan.riskAssessments.length > 0 && (
        <section aria-labelledby="risk-heading">
          <h3 id="risk-heading" className="font-semibold text-lg">
            Risk by household member
          </h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {plan.riskAssessments.map((risk) => (
              <div
                key={risk.memberLabel}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">
                    {risk.memberLabel}
                    {risk.count > 1 ? ` × ${risk.count}` : ""}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      RISK_BADGE_STYLES[risk.riskLevel]
                    }`}
                  >
                    {risk.riskLevel}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-foreground/70">{risk.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {plan.bestWindows.length > 0 && (
        <section aria-labelledby="windows-heading">
          <h3
            id="windows-heading"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <Clock className="h-5 w-5 text-brand" aria-hidden="true" />
            Best hours to be outdoors today
          </h3>
          <ul className="mt-4 flex flex-wrap gap-3">
            {plan.bestWindows.map((window) => (
              <li
                key={window.startTime}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium"
              >
                {formatHour(window.startTime, airQuality.location.timezone)} ·
                AQI {window.usAqi}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="routines-heading">
        <h3 id="routines-heading" className="font-semibold text-lg">
          Recommended routine
        </h3>
        <ul className="mt-4 space-y-3">
          {plan.routines.map((routine) => (
            <li
              key={routine.title}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{routine.title}</span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    PRIORITY_BADGE_STYLES[routine.priority]
                  }`}
                >
                  {routine.priority} priority
                </span>
              </div>
              <p className="mt-1.5 text-sm text-foreground/70">{routine.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="indoor-heading">
        <h3 id="indoor-heading" className="font-semibold text-lg">
          Indoor air quality hacks
        </h3>
        <ul className="mt-4 grid sm:grid-cols-2 gap-4">
          {plan.indoorHacks.map((hack) => (
            <li
              key={hack.title}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <p className="font-medium">{hack.title}</p>
              <p className="mt-1.5 text-sm text-foreground/70">{hack.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {plan.sustainableSwaps.length > 0 && (
        <section aria-labelledby="swaps-heading">
          <h3
            id="swaps-heading"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <Leaf className="h-5 w-5 text-brand" aria-hidden="true" />
            Sustainable swaps
          </h3>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            {plan.sustainableSwaps.map((swap) => (
              <li
                key={swap.title}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <p className="font-medium">{swap.title}</p>
                <p className="mt-1.5 text-sm text-foreground/70">{swap.detail}</p>
                <dl className="mt-3 flex gap-6 text-sm">
                  <div>
                    <dt className="text-foreground/60">Exposure cut</dt>
                    <dd className="font-semibold text-aqi-good">
                      ~{swap.pm25ExposureReductionPct}%
                    </dd>
                  </div>
                  <div>
                    <dt className="text-foreground/60">CO2 saved / week</dt>
                    <dd className="font-semibold text-aqi-good">
                      {swap.co2ReductionKgPerWeek} kg
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </section>
      )}

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
            <p className="text-2xl font-bold">
              {plan.impact.currentWeeklyPm25ExposureIndex}
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground/60">Exposure index with plan</p>
            <p className="text-2xl font-bold text-aqi-good">
              {plan.impact.improvedWeeklyPm25ExposureIndex}
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground/60">CO2 reduced / week</p>
            <p className="text-2xl font-bold text-aqi-good">
              {plan.impact.co2ReductionKgPerWeek} kg
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-foreground/60">
          {plan.impact.assumptionsNote}
        </p>
      </section>
    </div>
  );
}
