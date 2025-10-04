import React, { useState, useEffect } from "react";
import { VocabularyItem } from "../../data-types";
import { FillExercise } from "../../data-types/VocabularyExercisesProps";
import { FillNounExercise } from "./FillNounExercise";
import { FillVerbExercise } from "./FillVerbExercise";
import { FillAdjectiveExercise } from "./FillAdjectiveExercise";
import { FillNumeralExercise } from "./FillNumeralExercise";

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
          partOfSpeech: word.partOfSpeech,
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
      {fillExercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200"
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {exercise.word} ({exercise.partOfSpeech})
            </h3>
          </div>

          <FillNounExercise
            exercise={exercise}
            onUpdateExercise={updateExercise}
          />

          <FillVerbExercise
            exercise={exercise}
            onUpdateExercise={updateExercise}
          />

          <FillAdjectiveExercise
            exercise={exercise}
            onUpdateExercise={updateExercise}
          />

          <FillNumeralExercise
            exercise={exercise}
            onUpdateExercise={updateExercise}
          />
        </div>
      ))}
      {/* Verify Button */}
      <div className="flex justify-center pt-4 mt-6 mb-6 border-t border-gray-200">
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
