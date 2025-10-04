import { render, screen } from "@testing-library/react";
import EmptyState from "./EmptyState";
import userEvent from "@testing-library/user-event";

const onClearSearhMock = jest.fn();

describe("EmptyState component", () => {
  test("render default component without props", async () => {
    render(<EmptyState />);
    expect(screen.getByText("🔍")).toBeInTheDocument();
    expect(screen.getByText("No words found")).toBeInTheDocument();
    expect(
      screen.getByText("No vocabulary words available")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /Clear search/i,
      })
    ).not.toBeInTheDocument();
  });

  test("render component with props", async () => {
    const title = "Cannot find search term";
    const description = "Search term is not found";
    const searchTerm = "boekhouder";
    const icon = "✗";
    const noSearchTermText = `No vocabulary words found matching "${searchTerm}"`;
    render(
      <EmptyState
        icon={icon}
        title={title}
        description={description}
        searchTerm={searchTerm}
        onClearSearch={onClearSearhMock}
      />
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText(searchTerm)).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) => element?.textContent === noSearchTermText
      )
    ).toBeInTheDocument();
    const clearButton = screen.getByRole("button", {
      name: /Clear search/i,
    });
    expect(clearButton).toBeInTheDocument();
    userEvent.click(clearButton);
    expect(onClearSearhMock).toHaveBeenCalled();
  });
});
