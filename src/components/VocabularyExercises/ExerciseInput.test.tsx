import { fireEvent, render, screen } from "@testing-library/react";
import { ExerciseInput } from "./ExerciseInput";

describe("ExerciseInput component", () => {
  test("render component with empty value", async () => {
    const onChangeMock = jest.fn();

    render(
      <ExerciseInput
        dataTestId="singular-noun"
        placeholder="kat"
        label="Singular form"
        value=""
        onChange={onChangeMock}
      />
    );
    const input = await screen.findByRole("textbox");
    expect(input.getAttribute("placeholder")).toBe("kat");
    expect(input).toHaveClass(
      "w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent px-3 py-2"
    );
    fireEvent.change(input, { target: { value: "boek" } });
    expect(onChangeMock).toHaveBeenCalledWith("boek");
  });

  test("render component with custom class and number value", async () => {
    const onChangeMock = jest.fn();

    render(
      <ExerciseInput
        dataTestId="numeric-form"
        placeholder="100"
        label="Numeric form"
        value="0"
        type="number"
        className="bg-blue-300 text-blue-950"
        size="lg"
        onChange={onChangeMock}
      />
    );
    const input = screen.getByLabelText("Numeric form");
    expect(input.getAttribute("placeholder")).toBe("100");
    expect(input).toHaveClass(
      "w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 text-lg"
    );
    fireEvent.change(input, { target: { value: "10" } });
    expect(onChangeMock).toHaveBeenCalledWith(10);
    const container = screen.getByTestId("numeric-form");
    expect(container).toHaveClass("bg-blue-300 text-blue-950");
  });
});
