import { Sparkles } from "lucide-react";
import type { AqiCategoryInfo } from "@/lib/types";

interface NarrativeSectionProps {
  narrative: string | null;
  categoryInfo: AqiCategoryInfo;
}

export function NarrativeSection({ narrative, categoryInfo }: NarrativeSectionProps) {
  if (narrative) {
    return (
      <section
        aria-labelledby="narrative-heading"
        className="rounded-2xl border border-brand/30 bg-brand/5 p-6 sm:p-8"
      >
        <h3 id="narrative-heading" className="flex items-center gap-2 font-semibold text-lg">
          <Sparkles className="h-5 w-5 text-brand" aria-hidden="true" />
          Your personalized summary
        </h3>
        <p className="mt-3 whitespace-pre-line text-foreground/90 leading-relaxed">
          {narrative}
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="narrative-fallback-heading"
      className="rounded-2xl border border-border bg-surface-muted p-6 sm:p-8"
    >
      <h3 id="narrative-fallback-heading" className="font-semibold text-lg">
        Your plan at a glance
      </h3>
      <p className="mt-2 text-sm text-foreground/70">
        {categoryInfo.label} air quality right now. Here is your complete, rule-based routine
        below.
      </p>
    </section>
  );
}
