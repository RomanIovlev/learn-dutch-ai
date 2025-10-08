import { fireEvent, render, screen } from "@testing-library/react";
import { FillNounExercise } from "./FillNounExercise";

describe("FillNounExercise component", () => {
  test("render component with exercise prop having noun 'bloem'", async () => {
    const onUpdateExerciseMock = jest.fn();
    const word = {
      id: 1,
      word: "de bloem",
      partOfSpeech: "noun" as const,
      plural: "",
      diminutive: "",
    };
    render(
      <FillNounExercise
        exercise={word}
        onUpdateExercise={onUpdateExerciseMock}
      />
    );

    const pluralInput = await screen.findByRole("textbox", { name: /Plural/ });
    const diminutiveInput = await screen.findByRole("textbox", {
      name: /Diminutive/,
    });

    expect(pluralInput.getAttribute("value")).toBe("");
    expect(diminutiveInput.getAttribute("value")).toBe("");

    fireEvent.change(pluralInput, { target: { value: "bloemen" } });
    expect(onUpdateExerciseMock).toBeCalledWith(1, { plural: "bloemen" });

    fireEvent.change(diminutiveInput, { target: { value: "bloemetje" } });
    expect(onUpdateExerciseMock).toBeCalledWith(1, { diminutive: "bloemetje" });
  });

  test("render component with exercise prop having adjective 'groot'", async () => {
    const onUpdateExerciseMock = jest.fn();
    const word = {
      id: 1,
      word: "groot",
      partOfSpeech: "adjective" as const,
      adjective: "groot",
    };

    render(
      <FillNounExercise
        exercise={word}
        onUpdateExercise={onUpdateExerciseMock}
      />
    );

    expect(screen.queryByText("Noun Forms")).not.toBeInTheDocument();
  });

  test("render component with exercise prop having noun without forms", async () => {
    const onUpdateExerciseMock = jest.fn();
    const word = {
      id: 1,
      word: "man",
      partOfSpeech: "noun" as const,
      plural: "mannen",
    };
    render(
      <FillNounExercise
        exercise={word}
        onUpdateExercise={onUpdateExerciseMock}
      />
    );

    const pluralInput = await screen.findByRole("textbox", { name: /Plural/ });
    const diminutiveInput = await screen.findByRole("textbox", {
      name: /Diminutive/,
    });

    expect(pluralInput.getAttribute("value")).toBe("mannen");
    expect(diminutiveInput.getAttribute("value")).toBe("");
  });
});
