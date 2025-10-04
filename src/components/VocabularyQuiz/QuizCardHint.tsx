import { type VocabularyMeaning } from "../../data-types";

export const QuizCardHint = ({
  meanings,
}: {
  meanings: VocabularyMeaning[];
}) => {
  <div className="banner-warning mb-4">
    <span>💡</span>
    <div className="text-center flex-1">
      <div className="text-sm font-medium mb-1">Context Hint:</div>
      {meanings
        .filter((meaning) => meaning.context)
        .map((meaning) => (
          <div className="italic text-lg" key={meaning.meaning}>
            {meaning.context}
          </div>
        ))}
    </div>
  </div>;
};
