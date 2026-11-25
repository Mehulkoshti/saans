"use client";

import { StepShell } from "./StepShell";
import { CheckboxField, NumberField, TextField } from "./fields";
import type { LifestyleInput } from "@/lib/types";

interface LocationHouseholdStepProps {
  value: LifestyleInput;
  onChange: (value: LifestyleInput) => void;
  onNext: () => void;
  error?: string;
}

export function LocationHouseholdStep({
  value,
  onChange,
  onNext,
  error,
}: LocationHouseholdStepProps) {
  const canProceed = value.cityQuery.trim().length >= 2;

  return (
    <StepShell
      step={1}
      totalSteps={2}
      title="Where do you live, and who's home?"
      description="We'll pull live air-quality data for your city and tailor the plan to your household."
    >
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (canProceed) onNext();
        }}
      >
        <TextField
          label="City"
          placeholder="e.g. Delhi, Mumbai, Lahore, Beijing"
          value={value.cityQuery}
          error={error}
          autoFocus
          onChange={(cityQuery) => onChange({ ...value, cityQuery })}
        />

        <fieldset className="rounded-xl border border-border p-4">
          <legend className="px-1 text-sm font-semibold">Household</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <NumberField
              label="Adults"
              min={0}
              max={20}
              value={value.household.adults}
              onChange={(adults) =>
                onChange({ ...value, household: { ...value.household, adults } })
              }
            />
            <NumberField
              label="Children"
              min={0}
              max={20}
              value={value.household.children}
              onChange={(children) =>
                onChange({ ...value, household: { ...value.household, children } })
              }
            />
            <NumberField
              label="Elderly"
              min={0}
              max={20}
              value={value.household.elderly}
              onChange={(elderly) =>
                onChange({ ...value, household: { ...value.household, elderly } })
              }
            />
          </div>
          <div className="mt-4 space-y-3">
            <CheckboxField
              label="Someone in the household has a respiratory or cardiac condition"
              checked={value.household.hasRespiratoryCondition}
              onChange={(hasRespiratoryCondition) =>
                onChange({
                  ...value,
                  household: { ...value.household, hasRespiratoryCondition },
                })
              }
            />
            <CheckboxField
              label="Someone in the household is pregnant"
              checked={value.household.hasPregnantMember}
              onChange={(hasPregnantMember) =>
                onChange({
                  ...value,
                  household: { ...value.household, hasPregnantMember },
                })
              }
            />
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={!canProceed}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 font-semibold text-brand-foreground transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Continue
        </button>
      </form>
    </StepShell>
  );
}
