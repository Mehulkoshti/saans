import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { PRIORITY_BADGE_STYLES } from "@/components/badgeStyles";
import type { RoutineRecommendation } from "@/lib/types";

interface RoutinesSectionProps {
  routines: RoutineRecommendation[];
}

export function RoutinesSection({ routines }: RoutinesSectionProps) {
  return (
    <section aria-labelledby="routines-heading">
      <h3 id="routines-heading" className="font-semibold text-lg">
        Recommended routine
      </h3>
      <ul className="mt-4 space-y-3">
        {routines.map((routine) => (
          <Card as="li" key={routine.title}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{routine.title}</span>
              <Badge className={PRIORITY_BADGE_STYLES[routine.priority]}>
                {routine.priority} priority
              </Badge>
            </div>
            <p className="mt-1.5 text-sm text-foreground/70">{routine.detail}</p>
          </Card>
        ))}
      </ul>
    </section>
  );
}
