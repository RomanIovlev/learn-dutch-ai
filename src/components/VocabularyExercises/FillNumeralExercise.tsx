import { FillExercise } from "../../data-types/VocabularyExercisesProps";
import { ExerciseInput } from "./ExerciseInput";

export const FillNumeralExercise = ({
  exercise,
  onUpdateExercise,
}: {
  exercise: FillExercise;
  onUpdateExercise: (id: number, updates: Partial<FillExercise>) => void;
}) => {
  if (exercise.numericValue === undefined) {
    return null;
  }
  return (
    <div className="space-y-4 mb-6">
      <h4 className="font-medium text-gray-700">Numeral Forms</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExerciseInput
          dataTestId="numeric_value"
          label="Numeric Value"
          value={exercise.numericValue ?? 0}
          onChange={(value) => {
            onUpdateExercise(exercise.id, {
              numericValue: value as number,
            });
          }}
          placeholder="Numeric value"
          type="number"
        />
        <ExerciseInput
          dataTestId="ordinal_form"
          label="Ordinal Form"
          value={exercise.ordinalForm ?? ""}
          onChange={(value) => {
            onUpdateExercise(exercise.id, {
              ordinalForm: value as string,
            });
          }}
          placeholder="eerste, tweede, etc."
        />
      </div>
    </div>
  );
};
