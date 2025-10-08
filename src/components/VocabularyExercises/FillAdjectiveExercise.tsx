import { FillExercise } from "../../data-types/VocabularyExercisesProps";
import { ExerciseInput } from "./ExerciseInput";

export const FillAdjectiveExercise = ({
  exercise,
  onUpdateExercise,
}: {
  exercise: FillExercise;
  onUpdateExercise: (id: number, updates: Partial<FillExercise>) => void;
}) => {
  if (exercise.adjective === undefined) {
    return null;
  }
  return (
    <div className="space-y-4 mb-6">
      <h4 className="font-medium text-gray-700">Adjective Forms</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExerciseInput
          dataTestId="de-form"
          label="De-form"
          value={exercise.deForm ?? ""}
          onChange={(value) => {
            onUpdateExercise(exercise.id, { deForm: value as string });
          }}
          placeholder="kleine"
        />
        <ExerciseInput
          dataTestId="comparative"
          label="Comparative"
          value={exercise.comparison ?? ""}
          onChange={(value) => {
            onUpdateExercise(exercise.id, {
              comparison: value as string,
            });
          }}
          placeholder="kleiner"
        />
        <ExerciseInput
          dataTestId="superlative"
          label="Superlative"
          value={exercise.superlative ?? ""}
          onChange={(value) => {
            onUpdateExercise(exercise.id, {
              superlative: value as string,
            });
          }}
          placeholder="kleinst"
        />
      </div>
    </div>
  );
};
