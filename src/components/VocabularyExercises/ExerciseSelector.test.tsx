import { render, screen } from "@testing-library/react";
import { ExerciseSelector } from "./ExerciseSelector";
import userEvent from "@testing-library/user-event";

describe("ExerciseSelector component", () => {
  test("render component with prop exerciseForm = fill_forms", async () => {
    const onExerciseTypeChangeMock = jest.fn();
    render(
      <ExerciseSelector
        exerciseForm="fill_forms"
        onExerciseTypeChange={onExerciseTypeChangeMock}
      />
    );
    const fillFormsButton = await screen.findByRole("button", {
      name: /Fill Forms/i,
    });
    const fillGapsButton = await screen.findByRole("button", {
      name: /Fill Gaps/i,
    });
    expect(fillFormsButton).toHaveClass(
      "px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md"
    );
    expect(fillGapsButton).toHaveClass(
      "px-4 py-2 rounded-lg font-medium transition-all duration-200 text-muted-foreground hover:text-secondary hover:bg-muted/50"
    );
    userEvent.click(fillGapsButton);
    expect(onExerciseTypeChangeMock).toBeCalledWith("fill_gaps_in_sentences");
  });
  test("render component with prop exerciseForm = fill_gaps_in_sentences", async () => {
    const onExerciseTypeChangeMock = jest.fn();
    render(
      <ExerciseSelector
        exerciseForm="fill_gaps_in_sentences"
        onExerciseTypeChange={onExerciseTypeChangeMock}
      />
    );
    const fillFormsButton = await screen.findByRole("button", {
      name: /Fill Forms/i,
    });
    const fillGapsButton = await screen.findByRole("button", {
      name: /Fill Gaps/i,
    });
    expect(fillGapsButton).toHaveClass(
      "px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-secondary to-brand-600 text-white shadow-md"
    );
    expect(fillFormsButton).toHaveClass(
      "px-4 py-2 rounded-lg font-medium transition-all duration-200 text-muted-foreground hover:text-brand-600 hover:bg-muted/50"
    );
    userEvent.click(fillFormsButton);
    expect(onExerciseTypeChangeMock).toBeCalledWith("fill_forms");
  });
});
