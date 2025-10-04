import { render, screen } from "@testing-library/react";
import Loading from "./Loading";

describe("Loading component", () => {
  test("render default component without props", async () => {
    render(<Loading />);
    expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();
  });

  test("render component with custom message", async () => {
    render(<Loading message="Custom loading message" />);
    expect(
      await screen.findByText(/Custom loading message/i)
    ).toBeInTheDocument();
  });

  test("render component with sm size prop", async () => {
    render(<Loading size="sm" />);

    const container = screen.getByTestId("loading-container");
    expect(container).toHaveAttribute("data-size", "sm");
    expect(container).toHaveClass("py-6");

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("h-5 w-5");
  });

  test("render component with lg size prop", async () => {
    render(<Loading size="lg" />);

    const container = screen.getByTestId("loading-container");
    expect(container).toHaveAttribute("data-size", "lg");
    expect(container).toHaveClass("py-16");

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("h-12 w-12");
  });

  test("render component with custom style class", async () => {
    render(<Loading className="bg-gradient-to-t from-slate-600 to-zinc-300" />);

    const container = screen.getByTestId("loading-container");
    expect(container).toHaveClass(
      "bg-gradient-to-t from-slate-600 to-zinc-300"
    );
  });
});
