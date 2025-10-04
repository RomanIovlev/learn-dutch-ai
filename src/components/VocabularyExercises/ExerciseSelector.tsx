import { SelectorType } from "../../types/vocabulary";

export const ExerciseSelector = ({
  exerciseForm,
  onExerciseTypeChange,
}: {
  exerciseForm: SelectorType;
  onExerciseTypeChange: (switchType: SelectorType) => void;
}) => {
  return (
    <div className="mb-6 flex justify-center">
      <div className="bg-background rounded-xl shadow-md border border-border p-2 flex gap-2">
        <button
          onClick={() => onExerciseTypeChange("fill_forms")}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            exerciseForm === "fill_forms"
              ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md"
              : "text-muted-foreground hover:text-brand-600 hover:bg-muted/50"
          }`}
        >
          📚 Fill Forms
        </button>
        <button
          onClick={() => onExerciseTypeChange("fill_gaps_in_sentences")}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            exerciseForm === "fill_gaps_in_sentences"
              ? "bg-gradient-to-r from-secondary to-brand-600 text-white shadow-md"
              : "text-muted-foreground hover:text-secondary hover:bg-muted/50"
          }`}
        >
          📝 Fill Gaps
        </button>
      </div>
    </div>
  );
};
