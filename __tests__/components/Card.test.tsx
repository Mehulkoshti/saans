import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "@/components/Card";

describe("Card", () => {
  it("renders as a div by default", () => {
    render(<Card>content</Card>);
    expect(screen.getByText("content").tagName).toBe("DIV");
  });

  it("renders as an li when as='li'", () => {
    render(
      <ul>
        <Card as="li">row</Card>
      </ul>
    );
    expect(screen.getByText("row").tagName).toBe("LI");
  });
});
