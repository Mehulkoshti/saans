import { AQI_STYLES } from "./aqiStyles";
import type { AqiCategoryInfo } from "@/lib/types";

interface AqiGaugeProps {
  usAqi: number;
  categoryInfo: AqiCategoryInfo;
  locationLabel: string;
}

const MAX_SCALE = 300;
const RADIUS = 80;
const CIRCUMFERENCE = Math.PI * RADIUS;

export function AqiGauge({ usAqi, categoryInfo, locationLabel }: AqiGaugeProps) {
  const clamped = Math.min(usAqi, MAX_SCALE);
  const fraction = clamped / MAX_SCALE;
  const dashOffset = CIRCUMFERENCE * (1 - fraction);
  const styles = AQI_STYLES[categoryInfo.category];

  return (
    <figure
      role="img"
      aria-label={`Air quality in ${locationLabel} is ${usAqi} on the US AQI scale, categorized as ${categoryInfo.label}. ${categoryInfo.guidance}`}
      className="flex flex-col items-center"
    >
      <svg viewBox="0 0 200 110" className="w-64 h-auto" aria-hidden="true">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth={16}
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          strokeWidth={16}
          strokeLinecap="round"
          className={styles.stroke}
          stroke="currentColor"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
        <text
          x="100"
          y="85"
          textAnchor="middle"
          className={`text-4xl font-bold ${styles.text}`}
          fill="currentColor"
        >
          {usAqi}
        </text>
      </svg>
      <figcaption className="mt-2 text-center">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${styles.bgSoft} ${styles.text} ${styles.border}`}
        >
          {categoryInfo.label}
        </span>
        <p className="mt-2 text-sm text-foreground/70 max-w-xs">
          {categoryInfo.guidance}
        </p>
      </figcaption>
    </figure>
  );
}
