import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

describe("SiteHeader", () => {
  it("links the brand to home and the CTA to the assistant", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /saans/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Check your air" })).toHaveAttribute(
      "href",
      "/app"
    );
  });
});

describe("SiteFooter", () => {
  it("credits the challenge and the data source", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/PromptWars Virtual/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open-Meteo" })).toHaveAttribute(
      "href",
      "https://open-meteo.com/"
    );
  });
});
