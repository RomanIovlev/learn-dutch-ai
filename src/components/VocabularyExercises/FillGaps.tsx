import React, { useState, useEffect } from "react";

import { CheckCircle } from "lucide-react";
import {
  FillGapsProps,
  GapExercise,
} from "../../data-types/VocabularyExercisesProps";

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
                className="mx-1 px-2 py-1 border-b-2 border-brand-300 focus:border-brand-500 outline-none bg-transparent text-brand-700 font-medium min-w-[80px] text-center"
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
            className="mx-1 px-2 py-1 border-b-2 border-brand-300 focus:border-brand-500 outline-none bg-transparent text-brand-700 font-medium min-w-[80px] text-center"
            placeholder="..."
          />
        )}
      </React.Fragment>
    ));
  };

  if (examples.length === 0) {
    return (
      <div className="bg-gradient-to-br from-muted/50 to-muted rounded-2xl p-12 text-center border-2 border-dashed border-border">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No example sentences available
        </h3>
        <p className="text-muted-foreground">
          Add some vocabulary words with example sentences to practice gap
          filling exercises.
        </p>
        <button
          disabled={isLoading}
          className="my-10 px-8 py-3 bg-gradient-to-r from-secondary to-brand-600 text-white font-semibold rounded-xl hover:from-secondary/90 hover:to-brand-700 focus:ring-4 focus:ring-secondary/20 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:cursor-none disabled:from-muted disabled:to-muted"
          onClick={onFetchExamples}
        >
          Generate exercises
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" data-testid="fill-gap-exercises">
      {/* Header */}
      <div className="bg-gradient-to-br from-background via-secondary/10 to-brand-50 rounded-2xl shadow-xl border border-secondary/20 p-6 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-brand-600 bg-clip-text text-transparent mb-2">
            📝 Fill the Gaps Exercise
          </h2>
          <p className="text-secondary/70 text-sm">
            Fill in the missing words in the sentences below
          </p>
        </div>
      </div>

      {/* Words to Fill */}
      <div className="bg-background rounded-xl shadow-md border border-border p-4 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          🎯 Words to use:
        </h3>
        <div className="flex flex-wrap gap-2">
          {shuffledExamples.map((example) => (
            <span
              key={example.wordId}
              className="px-3 py-1 bg-gradient-to-r from-brand-100 to-brand-200 text-brand-700 rounded-full text-sm font-medium border border-brand-200"
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
            className="bg-background rounded-xl shadow-md border border-border p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-lg text-foreground leading-relaxed">
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
          className="px-8 py-3 bg-gradient-to-r from-secondary to-brand-600 text-white font-semibold rounded-xl hover:from-secondary/90 hover:to-brand-700 focus:ring-4 focus:ring-secondary/20 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <CheckCircle className="inline-block w-5 h-5 mr-2" />
          Verify Answers
        </button>
      </div>
    </div>
  );
};

export default FillGaps;
