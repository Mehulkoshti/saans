import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/Badge";

describe("Badge", () => {
  it("renders its children and applies the given className", () => {
    render(<Badge className="text-red-500">severe</Badge>);
    const badge = screen.getByText("severe");
    expect(badge).toHaveClass("text-red-500");
    expect(badge.tagName).toBe("SPAN");
  });
});
