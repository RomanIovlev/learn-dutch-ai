import { render, screen } from "@testing-library/react";
import { AppHeader } from "./AppHeader";
import { setMockActiveRoute } from "../__mocks__/react-router-dom";

jest.mock("react-router-dom");

describe("AppHeader component", () => {
  beforeEach(() => {
    // Reset mock active route before each test
    setMockActiveRoute(null);
  });

  test("renders component correctly", async () => {
    render(<AppHeader />);

    expect(screen.getByText(/Learning Dutch/i)).toBeInTheDocument();
    expect(screen.getByText(/Master Nederlands/i)).toBeInTheDocument();
    expect(screen.getByText(/Quiz Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/More Exercises/i)).toBeInTheDocument();
    expect(screen.getByText(/Vocabulary/i)).toBeInTheDocument();
    expect(screen.getByText(/🇳🇱/)).toBeInTheDocument();
  });

  test("applies active styles when quiz route is active", async () => {
    setMockActiveRoute("/quiz");

    render(<AppHeader />);

    const quizLink = screen.getByTestId("nav-link-/quiz");
    expect(quizLink).toHaveClass("bg-white/20", "text-white", "shadow-md");

    const exercisesLink = screen.getByTestId("nav-link-/exercises");
    expect(exercisesLink).toHaveClass("text-white/80");
    expect(exercisesLink).not.toHaveClass("bg-white/20");
  });

  test("applies active styles when exercises route is active", async () => {
    setMockActiveRoute("/exercises");

    render(<AppHeader />);

    const exercisesLink = screen.getByTestId("nav-link-/exercises");
    expect(exercisesLink).toHaveClass("bg-white/20", "text-white", "shadow-md");

    const quizLink = screen.getByTestId("nav-link-/quiz");
    expect(quizLink).toHaveClass("text-white/80");
    expect(quizLink).not.toHaveClass("bg-white/20");
  });
});
