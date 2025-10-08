import { type MouseEvent } from "react";

export const Actions = ({
  isShowApply,
  onResetQuiz,
  onUpdateResult,
}: {
  isShowApply: boolean;
  onResetQuiz: () => void;
  onUpdateResult: () => Promise<void>;
}) => {
  const handleRestQuiz = (e: MouseEvent) => {
    e.stopPropagation();
    onResetQuiz();
  };
  return (
    <div
      className="flex justify-center items-center gap-2 w-full"
      data-testid="actions"
    >
      {isShowApply && (
        <button onClick={onUpdateResult} className="btn-primary max-w-48">
          Apply progress
        </button>
      )}
      <button onClick={handleRestQuiz} className="btn-secondary max-w-48">
        Reset All Progress
      </button>
    </div>
  );
};
