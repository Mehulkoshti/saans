import { Clock } from "lucide-react";
import type { BestWindow } from "@/lib/types";
import { formatHour } from "./formatHour";

interface BestWindowsSectionProps {
  bestWindows: BestWindow[];
  timezone: string;
}

export function BestWindowsSection({ bestWindows, timezone }: BestWindowsSectionProps) {
  if (bestWindows.length === 0) return null;

  return (
    <section aria-labelledby="windows-heading">
      <h3 id="windows-heading" className="flex items-center gap-2 font-semibold text-lg">
        <Clock className="h-5 w-5 text-brand" aria-hidden="true" />
        Best hours to be outdoors today
      </h3>
      <ul className="mt-4 flex flex-wrap gap-3">
        {bestWindows.map((window) => (
          <li
            key={window.startTime}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium"
          >
            {formatHour(window.startTime, timezone)} · AQI {window.usAqi}
          </li>
        ))}
      </ul>
    </section>
  );
}
