import { render, screen } from "@testing-library/react";
import { ExerciseBanner } from "./ExerciseBanner";
import userEvent from "@testing-library/user-event";

describe("ExerciseBanner component", () => {
  describe("SuccessBanner", () => {
    const onDismissMock = jest.fn();
    test("render visible banner with default props", async () => {
      render(
        <ExerciseBanner
          bannerType="success"
          isVisible={true}
          onDismiss={onDismissMock}
        />
      );
      const dismissButton = await screen.findByRole("button", {
        name: /Dismiss/i,
      });
      expect(
        screen.getByText(/Excellent work! All answers are correct! 🎉/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /You've mastered these Dutch vocabulary forms. Keep up the great work!/i
        )
      ).toBeInTheDocument();
      userEvent.click(dismissButton);
      expect(onDismissMock).toHaveBeenCalled();
    });
    test("render visible banner with custom props", async () => {
      render(
        <ExerciseBanner
          bannerType="success"
          isVisible={true}
          onDismiss={onDismissMock}
          title="Congrats"
          message="All verb forms are correct"
        />
      );
      expect(screen.getByText(/Congrats/i)).toBeInTheDocument();
      expect(
        screen.getByText(/All verb forms are correct/i)
      ).toBeInTheDocument();
    });
    test("render banner with isVisible false", async () => {
      render(
        <ExerciseBanner
          bannerType="success"
          isVisible={false}
          onDismiss={onDismissMock}
        />
      );
      expect(
        screen.queryByText(/Excellent work! All answers are correct! 🎉/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          /You've mastered these Dutch vocabulary forms. Keep up the great work!/i
        )
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: /Dismiss/i,
        })
      ).not.toBeInTheDocument();
    });
  });
  describe("ErrorBanner", () => {
    const onDismissMock = jest.fn();
    test("render visible banner with default props and list of words", () => {
      const words = ["eland", "hert", "haas", "zwijn", "wolf"];
      render(
        <ExerciseBanner
          bannerType="error"
          words={words}
          isVisible={true}
          onDismiss={onDismissMock}
        />
      );
      expect(
        screen.getByText(/Errors found in your answers/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Please review the following words:/i)
      ).toBeInTheDocument();
      const listItems = screen.getAllByRole("listitem");
      expect(listItems.map((item) => item.textContent)).toEqual(words);
      const banner = screen.getByTestId("exercise-banner");
      expect(banner).toHaveClass(
        "mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4"
      );
    });
  });
});
