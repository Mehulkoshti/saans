import { Leaf } from "lucide-react";
import { Card } from "@/components/Card";
import type { SustainableSwap } from "@/lib/types";

interface SwapsSectionProps {
  swaps: SustainableSwap[];
}

export function SwapsSection({ swaps }: SwapsSectionProps) {
  if (swaps.length === 0) return null;

  return (
    <section aria-labelledby="swaps-heading">
      <h3 id="swaps-heading" className="flex items-center gap-2 font-semibold text-lg">
        <Leaf className="h-5 w-5 text-brand" aria-hidden="true" />
        Sustainable swaps
      </h3>
      <ul className="mt-4 grid sm:grid-cols-2 gap-4">
        {swaps.map((swap) => (
          <Card as="li" key={swap.title}>
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
                <dd className="font-semibold text-aqi-good">{swap.co2ReductionKgPerWeek} kg</dd>
              </div>
            </dl>
          </Card>
        ))}
      </ul>
    </section>
  );
}
