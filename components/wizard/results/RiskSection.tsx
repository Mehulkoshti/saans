import { Badge } from "@/components/Badge";
import { Card } from "@/components/Card";
import { RISK_BADGE_STYLES } from "@/components/badgeStyles";
import type { RiskAssessment } from "@/lib/types";

interface RiskSectionProps {
  riskAssessments: RiskAssessment[];
}

export function RiskSection({ riskAssessments }: RiskSectionProps) {
  if (riskAssessments.length === 0) return null;

  return (
    <section aria-labelledby="risk-heading">
      <h3 id="risk-heading" className="font-semibold text-lg">
        Risk by household member
      </h3>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        {riskAssessments.map((risk) => (
          <Card key={risk.memberLabel}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">
                {risk.memberLabel}
                {risk.count > 1 ? ` × ${risk.count}` : ""}
              </span>
              <Badge className={RISK_BADGE_STYLES[risk.riskLevel]}>{risk.riskLevel}</Badge>
            </div>
            <p className="mt-1.5 text-sm text-foreground/70">{risk.note}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
