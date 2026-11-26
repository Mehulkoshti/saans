import type { ReactNode } from "react";

interface StepShellProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: ReactNode;
}

export function StepShell({ step, totalSteps, title, description, children }: StepShellProps) {
  return (
    <div>
      <ol className="flex items-center gap-2 mb-6" aria-label="Form progress">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((n) => (
          <li key={n} className="flex items-center gap-2">
            <span
              aria-current={n === step ? "step" : undefined}
              className={`h-2.5 w-2.5 rounded-full ${
                n <= step ? "bg-brand" : "bg-border"
              }`}
            />
          </li>
        ))}
        <li className="ml-2 text-sm text-foreground/70">
          Step {step} of {totalSteps}
        </li>
      </ol>
      <h2 className="text-2xl font-bold">{title}</h2>
      {description ? (
        <p className="mt-1 text-foreground/70">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}
