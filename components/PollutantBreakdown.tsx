"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PollutantReading } from "@/lib/types";

interface PollutantBreakdownProps {
  pollutants: PollutantReading;
}

const POLLUTANT_LABELS: Record<keyof PollutantReading, string> = {
  pm2_5: "PM2.5",
  pm10: "PM10",
  no2: "NO₂",
  so2: "SO₂",
  o3: "O₃",
  co: "CO",
};

export function PollutantBreakdown({ pollutants }: PollutantBreakdownProps) {
  const data = (Object.keys(POLLUTANT_LABELS) as Array<keyof PollutantReading>)
    .filter((key) => typeof pollutants[key] === "number")
    .map((key) => ({
      name: POLLUTANT_LABELS[key],
      value: Math.round((pollutants[key] as number) * 10) / 10,
    }));

  if (data.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold">Pollutant concentrations (µg/m³)</h3>
      <div
        role="img"
        aria-label={`Pollutant levels: ${data
          .map((d) => `${d.name} ${d.value}`)
          .join(", ")}`}
        className="mt-3 h-56"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Bar dataKey="value" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
