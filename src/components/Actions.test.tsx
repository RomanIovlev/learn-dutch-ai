import { render, screen } from "@testing-library/react";
import { Actions } from "./Actions";
import userEvent from "@testing-library/user-event";

const onUpdateMock = jest.fn();
const onResetMock = jest.fn();
describe("Actions component", () => {
  test("render default component without 'Apply progress'", async () => {
    render(
      <Actions
        isShowApply={false}
        onUpdateResult={onUpdateMock}
        onResetQuiz={onResetMock}
      />
    );

    const resetButton = screen.getByRole("button", {
      name: /Reset All Progress/i,
    });
    expect(resetButton).toBeInTheDocument();

    const applyButton = screen.queryByRole("button", {
      name: /Apply progress/i,
    });
    expect(applyButton).not.toBeInTheDocument();
  });

  test("render component with 'Apply progress' button visible", async () => {
    render(
      <Actions
        isShowApply={true}
        onUpdateResult={onUpdateMock}
        onResetQuiz={onResetMock}
      />
    );

    const resetButton = screen.getByRole("button", {
      name: /Reset All Progress/i,
    });
    expect(resetButton).toBeInTheDocument();

    const applyButton = screen.getByRole("button", {
      name: /Apply progress/i,
    });
    expect(applyButton).toBeInTheDocument();
  });

  test("call Actions components methods", async () => {
    render(
      <Actions
        isShowApply={true}
        onUpdateResult={onUpdateMock}
        onResetQuiz={onResetMock}
      />
    );

    const resetButton = screen.getByRole("button", {
      name: /Reset All Progress/i,
    });
    const applyButton = screen.getByRole("button", {
      name: /Apply progress/i,
    });

    userEvent.click(resetButton);
    expect(onResetMock).toHaveBeenCalled();

    userEvent.click(applyButton);
    expect(onUpdateMock).toBeCalled();
  });
});
