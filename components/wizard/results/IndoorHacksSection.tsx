import { Card } from "@/components/Card";
import type { IndoorHack } from "@/lib/types";

interface IndoorHacksSectionProps {
  indoorHacks: IndoorHack[];
}

export function IndoorHacksSection({ indoorHacks }: IndoorHacksSectionProps) {
  return (
    <section aria-labelledby="indoor-heading">
      <h3 id="indoor-heading" className="font-semibold text-lg">
        Indoor air quality hacks
      </h3>
      <ul className="mt-4 grid sm:grid-cols-2 gap-4">
        {indoorHacks.map((hack) => (
          <Card as="li" key={hack.title}>
            <p className="font-medium">{hack.title}</p>
            <p className="mt-1.5 text-sm text-foreground/70">{hack.detail}</p>
          </Card>
        ))}
      </ul>
    </section>
  );
}
