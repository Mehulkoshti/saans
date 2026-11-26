import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LocationHouseholdStep } from "@/components/wizard/LocationHouseholdStep";
import { LifestyleStep } from "@/components/wizard/LifestyleStep";
import type { LifestyleInput } from "@/lib/types";

const BASE_INPUT: LifestyleInput = {
  cityQuery: "",
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
};

describe("LocationHouseholdStep", () => {
  it("disables Continue until the city is at least 2 characters", () => {
    const onNext = vi.fn();
    render(
      <LocationHouseholdStep value={BASE_INPUT} onChange={vi.fn()} onNext={onNext} />
    );

    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onNext).not.toHaveBeenCalled();
  });

  it("enables Continue and submits once a valid city is entered", () => {
    const onNext = vi.fn();
    render(
      <LocationHouseholdStep
        value={{ ...BASE_INPUT, cityQuery: "Delhi" }}
        onChange={vi.fn()}
        onNext={onNext}
      />
    );

    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(onNext).toHaveBeenCalled();
  });

  it("shows a field error when passed", () => {
    render(
      <LocationHouseholdStep
        value={BASE_INPUT}
        onChange={vi.fn()}
        onNext={vi.fn()}
        error="City not found."
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("City not found.");
  });

  it("reports household field and checkbox changes via onChange", () => {
    const onChange = vi.fn();
    render(
      <LocationHouseholdStep
        value={{ ...BASE_INPUT, cityQuery: "Delhi" }}
        onChange={onChange}
        onNext={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText("Children"), { target: { value: "2" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ household: expect.objectContaining({ children: 2 }) })
    );

    fireEvent.change(screen.getByLabelText("Elderly"), { target: { value: "1" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ household: expect.objectContaining({ elderly: 1 }) })
    );

    fireEvent.click(
      screen.getByLabelText("Someone in the household has a respiratory or cardiac condition")
    );
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        household: expect.objectContaining({ hasRespiratoryCondition: true }),
      })
    );

    fireEvent.click(screen.getByLabelText("Someone in the household is pregnant"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        household: expect.objectContaining({ hasPregnantMember: true }),
      })
    );
  });
});

describe("LifestyleStep", () => {
  it("calls onBack when Back is clicked", () => {
    const onBack = vi.fn();
    render(
      <LifestyleStep
        value={BASE_INPUT}
        onChange={vi.fn()}
        onBack={onBack}
        onSubmit={vi.fn()}
        isSubmitting={false}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalled();
  });

  it("disables submit and shows progress text while submitting", () => {
    render(
      <LifestyleStep
        value={BASE_INPUT}
        onChange={vi.fn()}
        onBack={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting
      />
    );
    const button = screen.getByRole("button", { name: "Generating your plan…" });
    expect(button).toBeDisabled();
  });

  it("submits the form with onSubmit", () => {
    const onSubmit = vi.fn();
    render(
      <LifestyleStep
        value={BASE_INPUT}
        onChange={vi.fn()}
        onBack={vi.fn()}
        onSubmit={onSubmit}
        isSubmitting={false}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Get my plan" }));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("reports commute, outdoor hours, activity level, and purifier changes", () => {
    const onChange = vi.fn();
    render(
      <LifestyleStep
        value={BASE_INPUT}
        onChange={onChange}
        onBack={vi.fn()}
        onSubmit={vi.fn()}
        isSubmitting={false}
      />
    );

    fireEvent.change(screen.getByLabelText("Primary commute mode"), {
      target: { value: "car_solo" },
    });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ commute: "car_solo" }));

    fireEvent.change(screen.getByLabelText("Hours spent outdoors per day"), {
      target: { value: "4" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ outdoorHoursPerDay: 4 })
    );

    fireEvent.change(screen.getByLabelText("Typical activity level"), {
      target: { value: "active" },
    });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ activityLevel: "active" }));

    fireEvent.click(screen.getByLabelText("We already have an air purifier at home"));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hasAirPurifier: true }));
  });
});
