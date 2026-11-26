import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import AssistantPage from "@/app/app/page";

describe("Home (landing page)", () => {
  it("renders the hero heading and links to the assistant", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Breathe smarter through/ })
    ).toBeInTheDocument();
    const ctaLinks = screen.getAllByRole("link", { name: /check your air|get my plan/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
    ctaLinks.forEach((link) => expect(link).toHaveAttribute("href", "/app"));
  });

  it("lists all six feature cards", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Live, location-aware readings" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "AI-written, human-readable summary" })
    ).toBeInTheDocument();
  });
});

describe("AssistantPage (/app)", () => {
  it("renders the site chrome and the wizard's first step", () => {
    render(<AssistantPage />);
    expect(screen.getByRole("link", { name: "Check your air" })).toBeInTheDocument();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByText(/PromptWars Virtual/)).toBeInTheDocument();
  });
});
