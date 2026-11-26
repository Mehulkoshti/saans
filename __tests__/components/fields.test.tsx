import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  CheckboxField,
  NumberField,
  SelectField,
  TextField,
} from "@/components/wizard/fields";

describe("TextField", () => {
  it("renders the label, calls onChange, and wires up the error message", () => {
    const onChange = vi.fn();
    render(
      <TextField
        label="City"
        value=""
        onChange={onChange}
        error="Enter a city name."
      />
    );

    const input = screen.getByLabelText("City");
    fireEvent.change(input, { target: { value: "Mumbai" } });
    expect(onChange).toHaveBeenCalledWith("Mumbai");

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Enter a city name.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", expect.stringContaining(alert.id));
  });
});

describe("NumberField", () => {
  it("parses numeric input and falls back to 0 for invalid input", () => {
    const onChange = vi.fn();
    render(<NumberField label="Adults" value={1} onChange={onChange} />);

    const input = screen.getByLabelText("Adults");
    fireEvent.change(input, { target: { value: "3" } });
    expect(onChange).toHaveBeenCalledWith(3);

    fireEvent.change(input, { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledWith(0);
  });
});

describe("SelectField", () => {
  it("renders all options and reports the selected value", () => {
    const onChange = vi.fn();
    render(
      <SelectField
        label="Commute"
        value="car_solo"
        options={[
          { value: "car_solo", label: "Car (solo)" },
          { value: "walk_cycle", label: "Walk or cycle" },
        ]}
        onChange={onChange}
      />
    );

    const select = screen.getByLabelText("Commute");
    fireEvent.change(select, { target: { value: "walk_cycle" } });
    expect(onChange).toHaveBeenCalledWith("walk_cycle");
    expect(screen.getByText("Walk or cycle")).toBeInTheDocument();
  });
});

describe("CheckboxField", () => {
  it("toggles checked state via onChange", () => {
    const onChange = vi.fn();
    render(<CheckboxField label="Has purifier" checked={false} onChange={onChange} />);

    const checkbox = screen.getByLabelText("Has purifier");
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
