import { type VocabularyItem } from "../../data-types";

export const FlippingQuizCard = ({
  isCardFlipped,
  currentQuizItem,
  isShowResult,
}: {
  isCardFlipped: boolean;
  currentQuizItem: VocabularyItem;
  isShowResult: boolean;
}) => {
  return (
    <div className="quiz-card" data-testid="quiz-card">
      <div className={`quiz-card-inner ${isCardFlipped ? "flipped" : ""}`}>
        {!isShowResult ? (
          <div className="quiz-card-front bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <div className="text-center">
              <div className="text-6xl font-bold">{currentQuizItem.word}</div>
            </div>
          </div>
        ) : (
          <div
            className={`quiz-card-back bg-gradient-to-br from-success to-brand-600 text-white ${
              isShowResult ? "result-shown" : ""
            }`}
          >
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {currentQuizItem.meanings
                  ?.map((meaning) => meaning.meaning)
                  .join(", ")}
              </div>
              <div className="text-lg opacity-90 mb-2">
                ({currentQuizItem.partOfSpeech})
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
