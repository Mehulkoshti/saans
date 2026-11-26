import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BestWindowsSection } from "@/components/wizard/results/BestWindowsSection";
import { ImpactSection } from "@/components/wizard/results/ImpactSection";
import { IndoorHacksSection } from "@/components/wizard/results/IndoorHacksSection";
import { NarrativeSection } from "@/components/wizard/results/NarrativeSection";
import { RiskSection } from "@/components/wizard/results/RiskSection";
import { RoutinesSection } from "@/components/wizard/results/RoutinesSection";
import { SwapsSection } from "@/components/wizard/results/SwapsSection";
import type { AqiCategoryInfo, ImpactEstimate } from "@/lib/types";

const CATEGORY: AqiCategoryInfo = {
  category: "moderate",
  label: "Moderate",
  colorToken: "aqi-moderate",
  guidance: "Acceptable for most people.",
};

describe("RiskSection", () => {
  it("renders nothing when there are no risk assessments", () => {
    const { container } = render(<RiskSection riskAssessments={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a card with the risk level badge per household member", () => {
    render(
      <RiskSection
        riskAssessments={[
          { memberLabel: "Children", count: 2, riskLevel: "severe", note: "Limit play." },
        ]}
      />
    );
    expect(screen.getByText("Children × 2")).toBeInTheDocument();
    expect(screen.getByText("severe")).toBeInTheDocument();
    expect(screen.getByText("Limit play.")).toBeInTheDocument();
  });
});

describe("BestWindowsSection", () => {
  it("renders nothing when there are no windows", () => {
    const { container } = render(
      <BestWindowsSection bestWindows={[]} timezone="Asia/Kolkata" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("lists each window with its AQI", () => {
    render(
      <BestWindowsSection
        bestWindows={[{ startTime: "2026-11-26T05:00", endTime: "2026-11-26T05:00", usAqi: 90 }]}
        timezone="Asia/Kolkata"
      />
    );
    expect(screen.getByText(/AQI 90/)).toBeInTheDocument();
  });
});

describe("RoutinesSection", () => {
  it("renders every routine with its priority badge", () => {
    render(
      <RoutinesSection
        routines={[
          { title: "Stay indoors", detail: "Avoid outdoor exercise.", priority: "high" },
        ]}
      />
    );
    expect(screen.getByText("Stay indoors")).toBeInTheDocument();
    expect(screen.getByText("high priority")).toBeInTheDocument();
  });
});

describe("IndoorHacksSection", () => {
  it("renders each indoor hack", () => {
    render(
      <IndoorHacksSection
        indoorHacks={[{ title: "Box-fan filter", detail: "Low-cost HEPA alternative." }]}
      />
    );
    expect(screen.getByText("Box-fan filter")).toBeInTheDocument();
  });
});

describe("SwapsSection", () => {
  it("renders nothing when there are no swaps", () => {
    const { container } = render(<SwapsSection swaps={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders exposure cut and CO2 saved for each swap", () => {
    render(
      <SwapsSection
        swaps={[
          {
            title: "Carpool",
            detail: "Share your commute.",
            pm25ExposureReductionPct: 8,
            co2ReductionKgPerWeek: 2.4,
          },
        ]}
      />
    );
    expect(screen.getByText("~8%")).toBeInTheDocument();
    expect(screen.getByText("2.4 kg")).toBeInTheDocument();
  });
});

describe("ImpactSection", () => {
  it("renders the impact figures and assumptions note", () => {
    const impact: ImpactEstimate = {
      currentWeeklyPm25ExposureIndex: 70,
      improvedWeeklyPm25ExposureIndex: 46,
      exposureReductionPct: 35,
      co2ReductionKgPerWeek: 1.8,
      assumptionsNote: "Illustrative estimate.",
    };
    render(<ImpactSection impact={impact} />);
    expect(screen.getByText("70")).toBeInTheDocument();
    expect(screen.getByText("46")).toBeInTheDocument();
    expect(screen.getByText("1.8 kg")).toBeInTheDocument();
    expect(screen.getByText("Illustrative estimate.")).toBeInTheDocument();
  });
});

describe("NarrativeSection", () => {
  it("renders the AI narrative when present", () => {
    render(<NarrativeSection narrative="Here is your plan." categoryInfo={CATEGORY} />);
    expect(screen.getByText("Here is your plan.")).toBeInTheDocument();
    expect(screen.getByText("Your personalized summary")).toBeInTheDocument();
  });

  it("falls back to the deterministic summary when narrative is null", () => {
    render(<NarrativeSection narrative={null} categoryInfo={CATEGORY} />);
    expect(screen.getByText("Your plan at a glance")).toBeInTheDocument();
    expect(screen.getByText(/Moderate air quality right now/)).toBeInTheDocument();
  });
});
