import { FillExercise } from "../../data-types/VocabularyExercisesProps";
import { ExerciseInput } from "./ExerciseInput";

export const FillVerbExercise = ({
  exercise,
  onUpdateExercise,
}: {
  exercise: FillExercise;
  onUpdateExercise: (id: number, updates: Partial<FillExercise>) => void;
}) => {
  if (exercise.infinitive === undefined) {
    return null;
  }
  return (
    <div className="space-y-4 mb-6">
      <h4 className="font-medium text-gray-700">Verb Conjugations</h4>

      <ExerciseInput
        dataTestId="infinitive"
        label="Infinitive"
        value={exercise.infinitive}
        onChange={(value) => {
          onUpdateExercise(exercise.id, { infinitive: value as string });
        }}
        placeholder="Infinitive form"
        className="mb-4"
      />

      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-600 mb-2">
          Present Tense
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {exercise.present &&
            Object.entries(exercise.present).map(([pronoun, value]) => (
              <ExerciseInput
                dataTestId={`${pronoun}-verb-form`}
                key={pronoun}
                label={pronoun.charAt(0).toUpperCase() + pronoun.slice(1)}
                value={value as string}
                onChange={(newValue) => {
                  const currentPresent = exercise.present || {
                    ik: "",
                    jij: "",
                    u: "",
                    hij: "",
                    wij: "",
                  };
                  onUpdateExercise(exercise.id, {
                    present: {
                      ...currentPresent,
                      [pronoun]: newValue as string,
                    },
                  });
                }}
                placeholder={pronoun}
                size="sm"
              />
            ))}
        </div>
      </div>

      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-600 mb-2">Past Tense</h5>
        <div className="grid grid-cols-2 gap-3">
          <ExerciseInput
            dataTestId="singular-past-verb-form"
            label="Singular"
            value={exercise.past?.sg ?? ""}
            onChange={(value) => {
              const currentPast = exercise.past || { sg: "", pl: "" };
              onUpdateExercise(exercise.id, {
                past: { ...currentPast, sg: value as string },
              });
            }}
            placeholder="Past singular"
            size="sm"
          />
          <ExerciseInput
            dataTestId="plural-past-verb-form"
            label="Plural"
            value={exercise.past?.pl ?? ""}
            onChange={(value) => {
              const currentPast = exercise.past || { sg: "", pl: "" };
              onUpdateExercise(exercise.id, {
                past: { ...currentPast, pl: value as string },
              });
            }}
            placeholder="Past plural"
            size="sm"
          />
        </div>
      </div>

      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-600 mb-2">
          Perfect Tense
        </h5>
        <div className="grid grid-cols-2 gap-3">
          <ExerciseInput
            dataTestId="auxiliary-verb-form"
            label="Auxiliary"
            value={exercise.perfect?.aux ?? ""}
            onChange={(value) => {
              const currentPerfect = exercise.perfect || {
                aux: "",
                participle: "",
              };
              onUpdateExercise(exercise.id, {
                perfect: { ...currentPerfect, aux: value as string },
              });
            }}
            placeholder="hebben/zijn"
            size="sm"
          />
          <ExerciseInput
            dataTestId="participle-verb-form"
            label="Participle"
            value={exercise.perfect?.participle ?? ""}
            onChange={(value) => {
              const currentPerfect = exercise.perfect || {
                aux: "",
                participle: "",
              };
              onUpdateExercise(exercise.id, {
                perfect: {
                  ...currentPerfect,
                  participle: value as string,
                },
              });
            }}
            placeholder="Past participle"
            size="sm"
          />
        </div>
      </div>

      <ExerciseInput
        dataTestId="separable-prefix-verb-form"
        label="Separable Prefix"
        value={exercise.separablePrefix || ""}
        onChange={(value) => {
          onUpdateExercise(exercise.id, {
            separablePrefix: value as string,
          });
        }}
        placeholder="Separable prefix (if any)"
      />
    </div>
  );
};
