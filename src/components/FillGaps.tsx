import React, { useState, useEffect } from "react";
import {
  FillGapsProps,
  GapExercise,
} from "../data-types/VocabularyExercisesProps";
import { CheckCircle } from "lucide-react";

const FillGaps: React.FC<FillGapsProps> = ({
  examples,
  onVerifyResult,
  onFetchExamples,
  isLoading,
}) => {
  const [gapExercises, setGapExercises] = useState<GapExercise[]>([]);
  const [shuffledExamples, setShuffledExamples] = useState<typeof examples>([]);

  useEffect(() => {
    // Initialize gap exercises from examples
    const initialExercises = examples.map((example) => ({
      wordId: example.wordId,
      word: example.word,
      exampleSentence: example.exampleSentence,
      userAnswer: "",
    }));
    setGapExercises(initialExercises);

    // Shuffle examples for word bank display
    const shuffled = [...examples].sort(() => Math.random() - 0.5);
    setShuffledExamples(shuffled);
  }, [examples]);

  const updateExercise = (wordId: number, userAnswer: string) => {
    setGapExercises((prev) =>
      prev.map((exercise) =>
        exercise.wordId === wordId ? { ...exercise, userAnswer } : exercise
      )
    );
  };

  const handleVerify = () => {
    onVerifyResult(gapExercises);
  };

  const renderSentenceWithGap = (
    sentence: string,
    word: string,
    wordId: number
  ) => {
    // Find the word in underscores and replace with input
    const pattern = new RegExp(`_${word}_`, "gi");
    const parts = sentence.split(pattern);

    if (parts.length === 1) {
      // If no underscore pattern found, look for the word directly
      const directPattern = new RegExp(`\\b${word}\\b`, "gi");
      const directParts = sentence.split(directPattern);

      if (directParts.length > 1) {
        return directParts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < directParts.length - 1 && (
              <input
                type="text"
                value={
                  gapExercises.find((ex) => ex.wordId === wordId)?.userAnswer ||
                  ""
                }
                onChange={(e) => updateExercise(wordId, e.target.value)}
                className="mx-1 px-2 py-1 border-b-2 border-indigo-300 focus:border-indigo-500 outline-none bg-transparent text-indigo-700 font-medium min-w-[80px] text-center"
                placeholder="..."
              />
            )}
          </React.Fragment>
        ));
      }
      return sentence;
    }

    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && (
          <input
            type="text"
            value={
              gapExercises.find((ex) => ex.wordId === wordId)?.userAnswer || ""
            }
            onChange={(e) => updateExercise(wordId, e.target.value)}
            className="mx-1 px-2 py-1 border-b-2 border-indigo-300 focus:border-indigo-500 outline-none bg-transparent text-indigo-700 font-medium min-w-[80px] text-center"
            placeholder="..."
          />
        )}
      </React.Fragment>
    ));
  };

  if (examples.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No example sentences available
        </h3>
        <p className="text-gray-500">
          Add some vocabulary words with example sentences to practice gap
          filling exercises.
        </p>
        <button
          disabled={isLoading}
          className="my-10 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:cursor-none disabled:from-slate-500 disabled:to-slate-300"
          onClick={onFetchExamples}
        >
          Generate exercises
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl shadow-xl border border-purple-100 p-6 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            📝 Fill the Gaps Exercise
          </h2>
          <p className="text-purple-600/70 text-sm">
            Fill in the missing words in the sentences below
          </p>
        </div>
      </div>

      {/* Words to Fill */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          🎯 Words to use:
        </h3>
        <div className="flex flex-wrap gap-2">
          {shuffledExamples.map((example) => (
            <span
              key={example.wordId}
              className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200"
            >
              {example.word}
            </span>
          ))}
        </div>
      </div>

      {/* Gap Exercises */}
      <div className="space-y-4 mb-8">
        {examples.map((example, index) => (
          <div
            key={example.exampleSentence}
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-lg text-gray-800 leading-relaxed">
                  {renderSentenceWithGap(
                    example.exampleSentence,
                    example.word,
                    example.wordId
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Verify Button */}
      <div className="text-center">
        <button
          onClick={handleVerify}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <CheckCircle className="inline-block w-5 h-5 mr-2" />
          Verify Answers
        </button>
      </div>
    </div>
  );
};

export default FillGaps;
