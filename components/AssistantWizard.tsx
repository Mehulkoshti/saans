"use client";

import { useRef, useState } from "react";
import { LocationHouseholdStep } from "./wizard/LocationHouseholdStep";
import { LifestyleStep } from "./wizard/LifestyleStep";
import { ResultsView } from "./wizard/ResultsView";
import type { AssistantPlan, LifestyleInput } from "@/lib/types";

const INITIAL_INPUT: LifestyleInput = {
  cityQuery: "",
  household: {
    adults: 1,
    children: 0,
    elderly: 0,
    hasRespiratoryCondition: false,
    hasPregnantMember: false,
  },
  commute: "two_wheeler",
  outdoorHoursPerDay: 2,
  hasAirPurifier: false,
  activityLevel: "moderate",
};

type WizardStage = "location" | "lifestyle" | "loading" | "results" | "error";

export function AssistantWizard() {
  const [stage, setStage] = useState<WizardStage>("location");
  const [input, setInput] = useState<LifestyleInput>(INITIAL_INPUT);
  const [result, setResult] = useState<AssistantPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  async function handleSubmit() {
    setStage("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setStage("error");
        return;
      }

      setResult(data as AssistantPlan);
      setStage("results");
    } catch {
      setErrorMessage(
        "We couldn't reach the server. Check your connection and try again."
      );
      setStage("error");
    }
  }

  function handleStartOver() {
    setInput(INITIAL_INPUT);
    setResult(null);
    setErrorMessage(null);
    setStage("location");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      <div ref={liveRegionRef} role="status" aria-live="polite" className="sr-only">
        {stage === "loading" ? "Generating your personalized air quality plan." : ""}
        {stage === "error" ? errorMessage : ""}
        {stage === "results" ? "Your plan is ready." : ""}
      </div>

      {stage === "location" && (
        <LocationHouseholdStep
          value={input}
          onChange={setInput}
          onNext={() => setStage("lifestyle")}
        />
      )}

      {stage === "lifestyle" && (
        <LifestyleStep
          value={input}
          onChange={setInput}
          onBack={() => setStage("location")}
          onSubmit={handleSubmit}
          isSubmitting={false}
        />
      )}

      {stage === "loading" && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="h-10 w-10 rounded-full border-4 border-border border-t-brand animate-spin"
            aria-hidden="true"
          />
          <p className="mt-6 text-lg font-medium">
            Reading live air quality for {input.cityQuery}…
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            Building your personalized routine
          </p>
        </div>
      )}

      {stage === "error" && (
        <div className="rounded-2xl border border-aqi-unhealthy/30 bg-aqi-unhealthy/5 p-8 text-center">
          <h2 className="text-xl font-bold">We hit a snag</h2>
          <p className="mt-2 text-foreground/70">{errorMessage}</p>
          <button
            onClick={() => setStage("lifestyle")}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 font-semibold text-brand-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Try again
          </button>
        </div>
      )}

      {stage === "results" && result && (
        <ResultsView result={result} onStartOver={handleStartOver} />
      )}
    </div>
  );
}
