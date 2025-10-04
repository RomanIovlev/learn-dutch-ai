import { VocabularyItem } from "../../data-types";

export const QuizCardResults = ({
  isCorrectAnswer,
  currentQuizItem,
}: {
  isCorrectAnswer: boolean;
  currentQuizItem: VocabularyItem;
}) => {
  return (
    <div className="card hover-lift mb-6">
      <div className="card-body text-center">
        <div
          className={`text-2xl font-bold mb-2 ${
            isCorrectAnswer ? "text-success" : "text-danger"
          }`}
        >
          {isCorrectAnswer ? "🎉 Correct!" : "❌ Incorrect"}
        </div>
        <div className="text-secondary text-lg italic">
          {/* {currentQuizItem.meaning.context} */}
        </div>

        {/* Examples */}
        {currentQuizItem.meanings[0]?.example &&
          currentQuizItem.meanings[0]?.exampleTranslation && (
            <div className="bg-brand-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-brand-800 mb-3 text-lg">
                Examples:
              </h4>
              {currentQuizItem.meanings?.map((example, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="text-brand-700 font-medium">
                    🇳🇱 {example.example}
                  </div>
                  <div className="text-secondary">
                    🇬🇧 {example.exampleTranslation}
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Click to continue indicator */}
        <div className="text-center text-secondary mt-6">
          <div className="inline-flex items-center space-x-2 bg-brand-100 px-4 py-2 rounded-full">
            <span>👆</span>
            <span>Click anywhere in this area to continue to next word</span>
          </div>
        </div>
      </div>
    </div>
  );
};
