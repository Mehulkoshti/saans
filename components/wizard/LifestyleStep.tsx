"use client";

import { StepShell } from "./StepShell";
import { CheckboxField, NumberField, SelectField } from "./fields";
import type { ActivityLevel, CommuteMode, LifestyleInput } from "@/lib/types";

const COMMUTE_OPTIONS: Array<{ value: CommuteMode; label: string }> = [
  { value: "walk_cycle", label: "Walk or cycle" },
  { value: "two_wheeler", label: "Two-wheeler" },
  { value: "car_solo", label: "Car (solo)" },
  { value: "car_pool", label: "Car (carpool)" },
  { value: "public_transport", label: "Public transport" },
  { value: "work_from_home", label: "Work from home" },
];

const ACTIVITY_OPTIONS: Array<{ value: ActivityLevel; label: string }> = [
  { value: "sedentary", label: "Mostly indoors / low activity" },
  { value: "moderate", label: "Regular walks or light exercise" },
  { value: "active", label: "Daily outdoor workouts or sports" },
];

interface LifestyleStepProps {
  value: LifestyleInput;
  onChange: (value: LifestyleInput) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function LifestyleStep({
  value,
  onChange,
  onBack,
  onSubmit,
  isSubmitting,
}: LifestyleStepProps) {
  return (
    <StepShell
      step={2}
      totalSteps={2}
      title="Your daily routine"
      description="This shapes which recommendations and swaps actually fit your life."
    >
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <SelectField
          label="Primary commute mode"
          value={value.commute}
          options={COMMUTE_OPTIONS}
          onChange={(commute) => onChange({ ...value, commute })}
        />

        <NumberField
          label="Hours spent outdoors per day"
          hint="Include commute, errands, play, and exercise."
          min={0}
          max={24}
          value={value.outdoorHoursPerDay}
          onChange={(outdoorHoursPerDay) =>
            onChange({ ...value, outdoorHoursPerDay })
          }
        />

        <SelectField
          label="Typical activity level"
          value={value.activityLevel}
          options={ACTIVITY_OPTIONS}
          onChange={(activityLevel) => onChange({ ...value, activityLevel })}
        />

        <CheckboxField
          label="We already have an air purifier at home"
          checked={value.hasAirPurifier}
          onChange={(hasAirPurifier) => onChange({ ...value, hasAirPurifier })}
        />

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 font-semibold transition hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 font-semibold text-brand-foreground transition hover:opacity-90 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {isSubmitting ? "Generating your plan…" : "Get my plan"}
          </button>
        </div>
      </form>
    </StepShell>
  );
}
