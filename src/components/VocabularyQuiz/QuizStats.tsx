import { Stat } from "../../data-types/VocabularyQuizProps";

export const QuizStats = ({
  stat,
  totalKnownWords,
}: {
  stat: Stat;
  totalKnownWords: number;
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="stat-card text-success">
        <div className="stat-value">{stat.correct}</div>
        <div className="stat-label">Correct</div>
      </div>
      <div className="stat-card text-danger">
        <div className="stat-value">{stat.incorrect}</div>
        <div className="stat-label">Incorrect</div>
      </div>
      <div className="stat-card text-primary">
        <div className="stat-value">{totalKnownWords}</div>
        <div className="stat-label">Known Meanings</div>
      </div>
    </div>
  );
};
