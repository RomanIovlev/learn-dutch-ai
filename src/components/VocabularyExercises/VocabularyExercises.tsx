import React, { useEffect, useState } from "react";
import type { VocabularyExercisesProps } from "../../data-types";
import { useUserQuizWords } from "../../hooks/useUserQuizWords";
import FillExercises from "./FillExercises";
import FillGaps from "./FillGaps";
import Loading from "../Loading";
import {
  FillExercise,
  GapExercise,
} from "../../data-types/VocabularyExercisesProps";
import { WordRank } from "../../data-types/VocabularyQuizProps";
import { ExerciseBanner } from "./ExerciseBanner";
import { useExampleSentences } from "../../hooks/useExampleSentences";
import { Actions } from "../Actions";
import { ExerciseSelector } from "./ExerciseSelector";

const VocabularyExercises: React.FC<VocabularyExercisesProps> = ({
  userId,
}) => {
  const { quizWords, onUpdateUserWordsRanks, isLoading } = useUserQuizWords(
    userId,
    true
  );
  const {
    examples,
    isLoading: isExampleLoading,
    fetchSentences,
  } = useExampleSentences(userId);

  const [wordsRanks, setWordsRanks] = useState<WordRank[]>([]);
  const [errorWords, setErrorWords] = useState<string[]>([]);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [newWordRanks, setNewWordRanks] = useState<WordRank[]>([]);

  useEffect(() => {
    setWordsRanks(
      quizWords.map((word) => ({
        wordId: word.id,
        rank: word.rating,
      }))
    );
  }, [quizWords]);

  const [exerciseForm, setExerciseForm] = useState<
    "fill_forms" | "fill_gaps_in_sentences"
  >("fill_forms");

  // Reset verification state when switching exercise types
  const handleExerciseTypeChange = (
    type: "fill_forms" | "fill_gaps_in_sentences"
  ) => {
    setExerciseForm(type);
    setIsVerified(false);
    setShowErrorBanner(false);
    setShowSuccessBanner(false);
    setErrorWords([]);
  };

  const handleVerifyGapResults = (exercises: GapExercise[]) => {
    // Compare wordsRanks with newWordRanks and find errors
    const errorWordsList: string[] = [];
    exercises.forEach((result) => {
      // Check if user answer matches the expected word (case insensitive)
      const answer = result.userAnswer.toLowerCase().trim();
      const userExample = result.exampleSentence
        .toLowerCase()
        .replace(/_\w+_/g, `_${answer}_`);

      const isCorrect = userExample === result.exampleSentence.toLowerCase();
      if (!isCorrect) {
        errorWordsList.push(result.word);
      }
    });

    setErrorWords(errorWordsList);
    setShowErrorBanner(errorWordsList.length > 0);
    setShowSuccessBanner(errorWordsList.length === 0);
    setIsVerified(true);
  };

  const handleVerifyResults = (exercises: FillExercise[]) => {
    const newWordRanks = [...wordsRanks];
    exercises.forEach((result) => {
      const word = quizWords.find((word) => word.id === result.id);
      const wordRankIndex = newWordRanks.findIndex(
        (word) => word.wordId === result.id
      );
      if (!word || wordRankIndex === -1) {
        return;
      }
      let rankUpdate = 0;
      if (word.noun) {
        rankUpdate =
          word.noun.plural === result.plural?.toLowerCase() &&
          word.noun.diminutive === result.diminutive?.toLowerCase()
            ? newWordRanks[wordRankIndex].rank + 1
            : newWordRanks[wordRankIndex].rank - 3;
      }
      if (word.adjective) {
        rankUpdate =
          word.adjective.comparison === result.comparison?.toLowerCase() &&
          word.adjective.deForm === result.deForm?.toLowerCase() &&
          word.adjective.superlative === result.superlative?.toLowerCase()
            ? newWordRanks[wordRankIndex].rank + 1
            : newWordRanks[wordRankIndex].rank - 3;
      }
      if (word.numeral) {
        rankUpdate =
          word.numeral.ordinalForm === result.ordinalForm &&
          word.numeral.numericValue === result.numericValue
            ? newWordRanks[wordRankIndex].rank + 1
            : newWordRanks[wordRankIndex].rank - 3;
      }
      if (word.verb) {
        rankUpdate =
          word.verb.infinitive === result.infinitive?.toLowerCase() &&
          word.verb.present?.ik === result.present?.ik?.toLowerCase() &&
          word.verb.present?.jij === result.present?.jij?.toLowerCase() &&
          word.verb.present?.u === result.present?.u?.toLowerCase() &&
          word.verb.present?.hij === result.present?.hij?.toLowerCase() &&
          word.verb.present?.wij === result.present?.wij?.toLowerCase() &&
          word.verb.past?.sg === result.past?.sg?.toLowerCase() &&
          word.verb.past?.pl === result.past?.pl?.toLowerCase() &&
          word.verb.perfect?.aux === result.perfect?.aux?.toLowerCase() &&
          word.verb.perfect?.participle ===
            result.perfect?.participle?.toLowerCase()
            ? newWordRanks[wordRankIndex].rank + 1
            : newWordRanks[wordRankIndex].rank - 3;
      }
      newWordRanks[wordRankIndex] = {
        wordId: newWordRanks[wordRankIndex].wordId,
        rank: rankUpdate > 0 ? rankUpdate : 0,
      };
    });

    // Compare wordsRanks with newWordRanks and find errors
    const errorWordsList: string[] = [];

    newWordRanks.forEach((newRank, index) => {
      const originalRank = wordsRanks[index];
      const word = quizWords.find(
        (w) => w.id.toString() === newRank.wordId.toString()
      );

      if (
        word &&
        (newRank.rank < originalRank.rank ||
          (newRank.rank === 0 && originalRank.rank === 0))
      ) {
        errorWordsList.push(word.word);
      }
    });

    setErrorWords(errorWordsList);
    setShowErrorBanner(errorWordsList.length > 0);
    setShowSuccessBanner(
      errorWordsList.length === 0 && newWordRanks.length > 0
    );
    setNewWordRanks(newWordRanks);
    setIsVerified(true);

    // Scroll to top to show banners
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSendResults = async () => {
    if (newWordRanks.length > 0) {
      setWordsRanks(newWordRanks);
      await onUpdateUserWordsRanks(newWordRanks);
      window.location.reload();
    }
  };

  const handleResetResults = () => {
    window.location.reload();
  };

  const handleFetchNewExercises = () => fetchSentences();

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Loading Indicator */}
      {isLoading ||
        (exerciseForm === "fill_gaps_in_sentences" && isExampleLoading && (
          <Loading message="Loading vocabulary exercises..." />
        ))}

      {!isLoading && (
        <>
          <ExerciseBanner
            bannerType="success"
            isVisible={showSuccessBanner}
            onDismiss={() => setShowSuccessBanner(false)}
          />

          <ExerciseBanner
            bannerType="error"
            isVisible={showErrorBanner}
            onDismiss={() => setShowErrorBanner(false)}
            words={errorWords}
          />

          <ExerciseSelector
            exerciseForm={exerciseForm}
            onExerciseTypeChange={handleExerciseTypeChange}
          />

          {exerciseForm === "fill_forms" && (
            <FillExercises
              onVerifyResult={handleVerifyResults}
              quizWords={quizWords}
            />
          )}

          {exerciseForm === "fill_gaps_in_sentences" && (
            <FillGaps
              examples={examples}
              onVerifyResult={handleVerifyGapResults}
              onFetchExamples={handleFetchNewExercises}
              isLoading={isExampleLoading}
            />
          )}

          <Actions
            isShowApply={isVerified}
            onResetQuiz={handleResetResults}
            onUpdateResult={handleSendResults}
          />
        </>
      )}
    </div>
  );
};

export default VocabularyExercises;
