import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AqiGauge } from "@/components/AqiGauge";
import type { AqiCategoryInfo } from "@/lib/types";

const UNHEALTHY: AqiCategoryInfo = {
  category: "unhealthy",
  label: "Unhealthy",
  colorToken: "aqi-unhealthy",
  guidance: "Everyone may begin to experience health effects.",
};

describe("AqiGauge", () => {
  it("exposes the AQI value and guidance through an accessible label", () => {
    render(
      <AqiGauge usAqi={180} categoryInfo={UNHEALTHY} locationLabel="Delhi, India" />
    );

    const figure = screen.getByRole("img");
    expect(figure).toHaveAccessibleName(
      "Air quality in Delhi, India is 180 on the US AQI scale, categorized as Unhealthy. Everyone may begin to experience health effects."
    );
    expect(screen.getByText("180")).toBeInTheDocument();
    expect(screen.getByText("Unhealthy")).toBeInTheDocument();
  });
});
