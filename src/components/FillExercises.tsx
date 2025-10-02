import React, { useState, useEffect } from "react";
import type { VocabularyItem } from "../data-types";
import { FillExercise } from "../data-types/VocabularyExercisesProps";

// Reusable Input Component
interface ExerciseInputProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  type?: "text" | "number";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ExerciseInput: React.FC<ExerciseInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2",
    lg: "px-4 py-3 text-lg",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={className}>
      <label
        className={`block font-medium text-gray-600 mb-1 ${labelSizeClasses[size]}`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          const newValue =
            type === "number" ? parseInt(e.target.value) || 0 : e.target.value;
          onChange(newValue);
        }}
        className={`w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${sizeClasses[size]}`}
        placeholder={placeholder}
      />
    </div>
  );
};

// Fill Exercises Component
interface FillExercisesProps {
  quizWords: VocabularyItem[];
  onVerifyResult: (items: FillExercise[]) => void;
}

const FillExercises: React.FC<FillExercisesProps> = ({
  quizWords,
  onVerifyResult,
}) => {
  const [fillExercises, setFillExercises] = useState<FillExercise[]>([]);

  useEffect(() => {
    const exercises = quizWords
      .filter(
        (word) => word.adjective || word.noun || word.numeral || word.verb
      )
      .map((word) => {
        const exercise: FillExercise = {
          id: word.id,
          word: word.word,
          partOfSpeech: word.meanings[0]?.pos || "noun",
        };

        if (word.noun) {
          exercise.plural = "";
          exercise.diminutive = "";
        }

        if (word.verb) {
          exercise.infinitive = "";
          exercise.present = {
            ik: "",
            jij: "",
            u: "",
            hij: "",
            wij: "",
          };
          exercise.past = {
            sg: "",
            pl: "",
          };
          exercise.perfect = {
            aux: "",
            participle: "",
          };
          exercise.separablePrefix = "";
          exercise.isSeparable = false;
          exercise.isIrregular = false;
          exercise.isStrongVerb = false;
          exercise.isMmodal = false;
        }

        if (word.adjective) {
          exercise.adjective = word.adjective.adjective;
          exercise.deForm = "";
          exercise.comparison = "";
          exercise.superlative = "";
        }

        if (word.numeral) {
          exercise.numericValue = 0;
          exercise.ordinalForm = "";
        }
        return exercise;
      });
    setFillExercises(exercises);
  }, [quizWords]);

  const handleVerifyExercise = () => {
    onVerifyResult(fillExercises);
  };

  const updateExercise = (
    exerciseId: number,
    updates: Partial<FillExercise>
  ) => {
    setFillExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
      )
    );
  };

  return (
    <>
      {fillExercises.map((exercise, index) => (
        <div
          key={`exercise-${exercise.id}-${index}`}
          className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200"
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {exercise.word} ({exercise.partOfSpeech})
            </h3>
          </div>

          {/* Noun inputs */}
          {exercise.plural !== undefined && (
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-700">Noun Forms</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ExerciseInput
                  label="Plural"
                  value={exercise.plural}
                  onChange={(value) => {
                    updateExercise(exercise.id, { plural: value as string });
                  }}
                  placeholder="Plural form"
                />
                <ExerciseInput
                  label="Diminutive"
                  value={exercise.diminutive ?? ""}
                  onChange={(value) => {
                    updateExercise(exercise.id, {
                      diminutive: value as string,
                    });
                  }}
                  placeholder="Diminutive form"
                />
              </div>
            </div>
          )}

          {/* Verb inputs */}
          {exercise.infinitive !== undefined && (
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-700">Verb Conjugations</h4>

              <ExerciseInput
                label="Infinitive"
                value={exercise.infinitive}
                onChange={(value) => {
                  updateExercise(exercise.id, { infinitive: value as string });
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
                        key={pronoun}
                        label={
                          pronoun.charAt(0).toUpperCase() + pronoun.slice(1)
                        }
                        value={value as string}
                        onChange={(newValue) => {
                          const currentPresent = exercise.present || {
                            ik: "",
                            jij: "",
                            u: "",
                            hij: "",
                            wij: "",
                          };
                          updateExercise(exercise.id, {
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
                <h5 className="text-sm font-medium text-gray-600 mb-2">
                  Past Tense
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  <ExerciseInput
                    label="Singular"
                    value={exercise.past?.sg ?? ""}
                    onChange={(value) => {
                      const currentPast = exercise.past || { sg: "", pl: "" };
                      updateExercise(exercise.id, {
                        past: { ...currentPast, sg: value as string },
                      });
                    }}
                    placeholder="Past singular"
                    size="sm"
                  />
                  <ExerciseInput
                    label="Plural"
                    value={exercise.past?.pl ?? ""}
                    onChange={(value) => {
                      const currentPast = exercise.past || { sg: "", pl: "" };
                      updateExercise(exercise.id, {
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
                    label="Auxiliary"
                    value={exercise.perfect?.aux ?? ""}
                    onChange={(value) => {
                      const currentPerfect = exercise.perfect || {
                        aux: "",
                        participle: "",
                      };
                      updateExercise(exercise.id, {
                        perfect: { ...currentPerfect, aux: value as string },
                      });
                    }}
                    placeholder="hebben/zijn"
                    size="sm"
                  />
                  <ExerciseInput
                    label="Participle"
                    value={exercise.perfect?.participle ?? ""}
                    onChange={(value) => {
                      const currentPerfect = exercise.perfect || {
                        aux: "",
                        participle: "",
                      };
                      updateExercise(exercise.id, {
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
                label="Separable Prefix"
                value={exercise.separablePrefix || ""}
                onChange={(value) => {
                  updateExercise(exercise.id, {
                    separablePrefix: value as string,
                  });
                }}
                placeholder="Separable prefix (if any)"
              />
            </div>
          )}

          {/* Adjective inputs */}
          {exercise.adjective !== undefined && (
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-700">Adjective Forms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ExerciseInput
                  label="De-form"
                  value={exercise.deForm ?? ""}
                  onChange={(value) => {
                    updateExercise(exercise.id, { deForm: value as string });
                  }}
                  placeholder="Definite form"
                />
                <ExerciseInput
                  label="Comparative"
                  value={exercise.comparison ?? ""}
                  onChange={(value) => {
                    updateExercise(exercise.id, {
                      comparison: value as string,
                    });
                  }}
                  placeholder="Comparative form"
                />
                <ExerciseInput
                  label="Superlative"
                  value={exercise.superlative ?? ""}
                  onChange={(value) => {
                    updateExercise(exercise.id, {
                      superlative: value as string,
                    });
                  }}
                  placeholder="Superlative form"
                />
              </div>
            </div>
          )}

          {/* Numeral inputs */}
          {exercise.numeral !== undefined && (
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-700">Numeral Forms</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ExerciseInput
                  label="Numeric Value"
                  value={exercise.numericValue ?? 0}
                  onChange={(value) => {
                    updateExercise(exercise.id, {
                      numericValue: value as number,
                    });
                  }}
                  placeholder="Numeric value"
                  type="number"
                />
                <ExerciseInput
                  label="Ordinal Form"
                  value={exercise.ordinalForm ?? ""}
                  onChange={(value) => {
                    updateExercise(exercise.id, {
                      ordinalForm: value as string,
                    });
                  }}
                  placeholder="eerste, tweede, etc."
                />
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Verify Button */}
      <div className="flex justify-center pt-4 mt-6 border-t border-gray-200">
        <button
          onClick={handleVerifyExercise}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Verify Resulsts
        </button>
      </div>
    </>
  );
};

export default FillExercises;
