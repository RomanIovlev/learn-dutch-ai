import { fireEvent, render, screen } from "@testing-library/react";
import { FillAdjectiveExercise } from "./FillAdjectiveExercise";

describe("FillAdjectiveExercise component", () => {
  test("render component with exercise prop having adjective 'groot'", async () => {
    const onUpdateExerciseMock = jest.fn();
    const word = {
      id: 1,
      word: "groot",
      partOfSpeech: "adjective" as const,
      adjective: "groot",
      deForm: "",
      comparison: "",
      superlative: "",
    };
    render(
      <FillAdjectiveExercise
        exercise={word}
        onUpdateExercise={onUpdateExerciseMock}
      />
    );

    const deFormInput = await screen.findByRole("textbox", { name: /De-form/ });
    const comparativeInput = await screen.findByRole("textbox", {
      name: /Comparative/,
    });
    const superlativeInput = await screen.findByRole("textbox", {
      name: /Superlative/,
    });

    expect(deFormInput.getAttribute("value")).toBe("");
    expect(comparativeInput.getAttribute("value")).toBe("");
    expect(superlativeInput.getAttribute("value")).toBe("");

    fireEvent.change(deFormInput, { target: { value: "grote" } });
    expect(onUpdateExerciseMock).toBeCalledWith(1, { deForm: "grote" });

    fireEvent.change(comparativeInput, { target: { value: "groter" } });
    expect(onUpdateExerciseMock).toBeCalledWith(1, { comparison: "groter" });

    fireEvent.change(superlativeInput, { target: { value: "grootst" } });
    expect(onUpdateExerciseMock).toBeCalledWith(1, { superlative: "grootst" });
  });

  test("render component with exercise prop having none 'kat'", async () => {
    const onUpdateExerciseMock = jest.fn();
    const word = {
      id: 1,
      word: "groot",
      partOfSpeech: "noun" as const,
      noun: "kat",
    };

    render(
      <FillAdjectiveExercise
        exercise={word}
        onUpdateExercise={onUpdateExerciseMock}
      />
    );

    expect(screen.queryByText("Adjective Forms")).not.toBeInTheDocument();
  });

  test("render component with exercise prop having adjective 'uniek' without forms", async () => {
    const onUpdateExerciseMock = jest.fn();
    const word = {
      id: 1,
      word: "uniek",
      partOfSpeech: "adjective" as const,
      adjective: "uniek",
    };
    render(
      <FillAdjectiveExercise
        exercise={word}
        onUpdateExercise={onUpdateExerciseMock}
      />
    );

    const deFormInput = await screen.findByRole("textbox", { name: /De-form/ });
    const comparativeInput = await screen.findByRole("textbox", {
      name: /Comparative/,
    });
    const superlativeInput = await screen.findByRole("textbox", {
      name: /Superlative/,
    });

    expect(deFormInput.getAttribute("value")).toBe("");
    expect(comparativeInput.getAttribute("value")).toBe("");
    expect(superlativeInput.getAttribute("value")).toBe("");
  });
});
