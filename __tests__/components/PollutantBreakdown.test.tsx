import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PollutantBreakdown } from "@/components/PollutantBreakdown";

describe("PollutantBreakdown", () => {
  it("renders nothing when every pollutant reading is null", () => {
    const { container } = render(
      <PollutantBreakdown
        pollutants={{ pm2_5: null, pm10: null, no2: null, so2: null, o3: null, co: null }}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders an accessible chart label with the available readings", () => {
    render(
      <PollutantBreakdown
        pollutants={{ pm2_5: 88.24, pm10: null, no2: 20, so2: null, o3: 30, co: null }}
      />
    );
    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Pollutant levels: PM2.5 88.2, NO₂ 20, O₃ 30"
    );
  });
});
