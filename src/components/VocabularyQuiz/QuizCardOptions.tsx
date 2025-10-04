import { type MouseEvent } from "react";
import { type VocabularyItem } from "../../data-types";

interface QuizCardOptionsProps {
  options: string[];
  isShowResult: boolean;
  currentQuizItem: VocabularyItem;
  selectedAnswer: string | null;
  onAnswerClick: (option: string) => void;
}

export const QuizCardOptions = ({
  options,
  isShowResult,
  currentQuizItem,
  selectedAnswer,
  onAnswerClick,
}: QuizCardOptionsProps) => {
  const getOptionClass = (option: string) => {
    if (!isShowResult) {
      return "quiz-option";
    }
    if (
      currentQuizItem?.meanings.map((meaning) => meaning.meaning).join(", ") ===
      option
    ) {
      return "quiz-option correct";
    } else if (option === selectedAnswer) {
      return "quiz-option incorrect";
    } else {
      return "quiz-option";
    }
  };

  const handleAnswerClick = (e: MouseEvent, option: string) => {
    if (!isShowResult) {
      e.stopPropagation();
      onAnswerClick(option);
    }
  };

  return (
    <div className="transition-all duration-500 opacity-100 translate-y-0">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={(e) => {
              handleAnswerClick(e, option);
            }}
            disabled={isShowResult}
            className={getOptionClass(option)}
            style={isShowResult ? { pointerEvents: "none" } : {}}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
