import React, { useState, useEffect, useCallback } from "react";
import type { VocabularyQuizProps, VocabularyItem } from "../../data-types";
import { Stat, WordRank } from "../../data-types/VocabularyQuizProps";
import { useUserQuizWords } from "../../hooks/useUserQuizWords";
import Loading from "../Loading";
import { FlippingQuizCard } from "./FlippingQuizCard";
import { QuizCardOptions } from "./QuizCardOptions";
import { QuizCardResults } from "./QuizCardResults";
import { Actions } from "../Actions";
import { QuizStats } from "./QuizStats";

const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({ userId }) => {
  const { quizWords, onUpdateUserWordsRanks } = useUserQuizWords(userId);

  const [currentQuizItem, setCurrentQuizItem] = useState<VocabularyItem | null>(
    null
  );
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState<Stat>({
    correct: 0,
    incorrect: 0,
    knownWords: 0,
  });
  const [wordsRanks, setWordsRanks] = useState<WordRank[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [isEndOfList, setIsEndOfList] = useState(false);

  useEffect(() => {
    if (quizWords.length > 0) {
      setCurrentQuizItem(quizWords[0]);
    }
  }, [quizWords]);

  const generateOptions = useCallback(
    (item: VocabularyItem) => {
      if (!item || !item.meanings || !item.word) {
        console.warn("Invalid quiz item provided");
        return;
      }

      const correctAnswer = item.meanings
        .map((meaning) => meaning.meaning)
        .join(", ");

      const currentDutchWord = item.word;

      if (!correctAnswer) {
        console.warn("Missing required data in quiz item");
        return;
      }

      // Get all possible wrong answers from all meanings of all words
      // EXCLUDE all meanings from the same Dutch word to avoid confusion
      const allWrongAnswers: string[] = [];
      quizWords.forEach((word) => {
        if (word.word !== currentDutchWord && word.meanings) {
          word.meanings.forEach((meaning) => {
            if (meaning && meaning.meaning) {
              allWrongAnswers.push(meaning.meaning);
            }
          });
        }
      });

      // Check if we have enough wrong answers
      // If we don't have enough wrong answers, use what we have and pad with empty strings if needed
      if (allWrongAnswers.length < 5) {
        console.warn(
          `Not enough wrong answers available. Found ${allWrongAnswers.length}, need 5`
        );
      }

      // Shuffle and take 5 wrong answers (or all if less than 5)
      const wrongAnswers = allWrongAnswers
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      // Create 6 options total (1 correct + up to 5 wrong) and shuffle them
      const allOptions = [correctAnswer, ...wrongAnswers].sort(
        () => Math.random() - 0.5
      );

      setOptions(allOptions);
    },
    [quizWords]
  );

  const selectNewWord = (index: number = 0) => {
    // Safety checks to prevent runtime errors
    if (quizWords.length === 0) {
      console.warn("No vocabulary data available");
      return;
    }

    if (index >= quizWords.length) {
      setIsEndOfList(true);
      return;
    }

    const selectedItem: VocabularyItem = { ...quizWords[index] };
    setItem(selectedItem);
    // setCurrentQuizItem(selectedItem);
    // generateOptions(selectedItem);
    // setSelectedAnswer(null);
    // setShowResult(false);
    // setIsCardFlipped(false);
    // setShowChoices(true);
  };

  useEffect(() => {
    if (quizWords && quizWords.length > 0 && !isInitialized) {
      // Only initialize the first word, don't freeze it yet
      const selectedItem: VocabularyItem = { ...quizWords[0] };

      // setCurrentQuizItem(selectedItem);
      // generateOptions(selectedItem);
      // setSelectedAnswer(null);
      // setShowResult(false);
      // setIsCardFlipped(false);
      // setShowChoices(true);
      setItem(selectedItem);
      setIsInitialized(true);
    }
  }, [quizWords, isInitialized, generateOptions]);

  const setItem = (item: VocabularyItem) => {
    setCurrentQuizItem(item);
    generateOptions(item);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCardFlipped(false);
    setShowChoices(true);
  };

  const handleAnswerClick = async (answer: string) => {
    if (selectedAnswer || !currentQuizItem) return;

    setSelectedAnswer(answer);

    setIsCardFlipped(true);

    // Show result after a short delay to let the flip animation start
    setTimeout(() => {
      setShowResult(true);
    });

    const isCorrect =
      currentQuizItem.meanings.map((meaning) => meaning.meaning).join(", ") ===
      answer;

    // Update ratings through parent component
    if (isCorrect) {
      setWordsRanks([
        ...wordsRanks,
        { wordId: currentQuizItem.id, rank: currentQuizItem.rating + 1 },
      ]);
    } else {
      setWordsRanks([
        ...wordsRanks,
        {
          wordId: currentQuizItem.id,
          rank: Math.max(currentQuizItem.rating - 3, 0),
        },
      ]);
    }

    // Update stats
    setStats((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
      knownWords: quizWords.reduce(
        (count, word) => count + (word.rating === 15 ? 1 : 0),
        0
      ),
    }));
  };

  const nextWord = async (index: number) => {
    setTimeout(() => {
      selectNewWord(index);
    });
  };

  const resetQuiz = async () => {
    setStats({ correct: 0, incorrect: 0, knownWords: 0 });
    setIsInitialized(false);
    setIsCardFlipped(false);
    setShowChoices(false);
    setShowResult(false);
    setIsEndOfList(false);
    setWordsRanks([]);
    if (quizWords.length > 0) {
      selectNewWord(0);
      setIsInitialized(true);
    }
  };

  const getTotalKnownWords = () => {
    return quizWords.reduce(
      (count, word) => count + (word.rating === 15 ? 1 : 0),
      0
    );
  };

  const handleContainerClick = () => {
    const index = quizWords.findIndex(
      (item) => item.id === currentQuizItem?.id
    );
    if (showResult) {
      nextWord(index + 1);
    }
  };

  const handleUpdateResult = async () => {
    await onUpdateUserWordsRanks(wordsRanks);
    resetQuiz();
  };

  const isCorrectAnswer = () =>
    currentQuizItem?.meanings?.map((meaning) => meaning.meaning).join(", ") ===
    selectedAnswer;

  if (!currentQuizItem || !quizWords || quizWords.length === 0) {
    return <Loading message="Loading quiz..." />;
  }

  return (
    <div
      className={`max-w-4xl mx-auto ${showResult ? "cursor-pointer" : ""}`}
      onClick={showResult ? handleContainerClick : undefined}
    >
      <QuizStats stat={stats} totalKnownWords={getTotalKnownWords()} />

      {!isEndOfList && (
        <>
          <FlippingQuizCard
            currentQuizItem={currentQuizItem}
            isCardFlipped={isCardFlipped}
            isShowResult={showResult}
          />

          {/* Instructions */}
          <div className="card mb-6" data-testid="instructions">
            <div className="card-body text-center">
              {!showResult && (
                <p className="text-lg font-medium text-brand-700">
                  What does "{currentQuizItem.word}" mean in English?
                </p>
              )}
            </div>
          </div>

          {showChoices && (
            <QuizCardOptions
              selectedAnswer={selectedAnswer}
              currentQuizItem={currentQuizItem}
              options={options}
              isShowResult={showResult}
              onAnswerClick={handleAnswerClick}
            />
          )}

          {showResult && (
            <QuizCardResults
              isCorrectAnswer={isCorrectAnswer()}
              currentQuizItem={currentQuizItem}
            />
          )}
        </>
      )}

      <Actions
        isShowApply={isEndOfList}
        onResetQuiz={resetQuiz}
        onUpdateResult={handleUpdateResult}
      />
    </div>
  );
};

export default VocabularyQuiz;
