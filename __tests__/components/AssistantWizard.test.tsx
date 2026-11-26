import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AssistantWizard } from "@/components/AssistantWizard";
import type { AssistantPlan } from "@/lib/types";

const PLAN: AssistantPlan = {
  input: {
    cityQuery: "Delhi",
    household: {
      adults: 1,
      children: 0,
      elderly: 0,
      hasRespiratoryCondition: false,
      hasPregnantMember: false,
    },
    commute: "two_wheeler",
    outdoorHoursPerDay: 2,
    hasAirPurifier: false,
    activityLevel: "moderate",
  },
  airQuality: {
    location: {
      name: "Delhi",
      admin1: "Delhi",
      country: "India",
      latitude: 28.6139,
      longitude: 77.209,
      timezone: "Asia/Kolkata",
    },
    observedAt: "2026-11-26T10:00",
    usAqi: 180,
    pollutants: { pm2_5: 90, pm10: 100, no2: 20, so2: 10, o3: 30, co: 400 },
    hourly: [{ time: "2026-11-26T10:00", usAqi: 180 }],
  },
  plan: {
    categoryInfo: {
      category: "unhealthy",
      label: "Unhealthy",
      colorToken: "aqi-unhealthy",
      guidance: "Everyone may begin to experience health effects.",
    },
    riskAssessments: [],
    bestWindows: [],
    routines: [
      { title: "Move exercise indoors", detail: "Avoid outdoor exertion.", priority: "high" },
    ],
    indoorHacks: [{ title: "Box-fan filter", detail: "Low-cost HEPA alternative." }],
    sustainableSwaps: [],
    impact: {
      currentWeeklyPm25ExposureIndex: 70,
      improvedWeeklyPm25ExposureIndex: 46,
      exposureReductionPct: 35,
      co2ReductionKgPerWeek: 1.8,
      assumptionsNote: "Illustrative estimate.",
    },
  },
  aiEnhanced: true,
  aiNarrative: "Here is your personalized plan.",
  generatedAt: "2026-11-26T10:00:05Z",
};

async function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("City"), { target: { value: "Delhi" } });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  fireEvent.click(await screen.findByRole("button", { name: "Get my plan" }));
}

describe("AssistantWizard", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("walks through both steps and renders the results on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => PLAN,
    }) as unknown as typeof fetch;

    render(<AssistantWizard />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText("Delhi, Delhi, India")).toBeInTheDocument();
    });
    expect(screen.getByText("Here is your personalized plan.")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/plan",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("shows the server's error message and allows retrying", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Couldn't find that city." }),
    }) as unknown as typeof fetch;

    render(<AssistantWizard />);
    await fillAndSubmit();

    expect(await screen.findByText("We hit a snag")).toBeInTheDocument();
    expect(screen.getByText("Couldn't find that city.", { selector: "p" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByRole("button", { name: "Get my plan" })).toBeInTheDocument();
  });

  it("shows a connection error when the request throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    render(<AssistantWizard />);
    await fillAndSubmit();

    expect(
      await screen.findByText(
        "We couldn't reach the server. Check your connection and try again.",
        { selector: "p" }
      )
    ).toBeInTheDocument();
  });
});
