import { FillExercise } from "../../data-types/VocabularyExercisesProps";
import { ExerciseInput } from "./ExerciseInput";

export const FillNounExercise = ({
  exercise,
  onUpdateExercise,
}: {
  exercise: FillExercise;
  onUpdateExercise: (id: number, updates: Partial<FillExercise>) => void;
}) => {
  if (exercise.plural === undefined) {
    return null;
  }
  return (
    <div className="space-y-4 mb-6">
      <h4 className="font-medium text-gray-700">Noun Forms</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExerciseInput
          dataTestId="plural"
          label="Plural"
          value={exercise.plural}
          onChange={(value) => {
            onUpdateExercise(exercise.id, { plural: value as string });
          }}
          placeholder="Plural form"
        />
        <ExerciseInput
          dataTestId="diminutive"
          label="Diminutive"
          value={exercise.diminutive ?? ""}
          onChange={(value) => {
            onUpdateExercise(exercise.id, {
              diminutive: value as string,
            });
          }}
          placeholder="Diminutive form"
        />
      </div>
    </div>
  );
};
