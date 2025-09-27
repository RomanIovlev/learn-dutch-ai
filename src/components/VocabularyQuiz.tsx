import React, { useState, useEffect, useCallback } from "react";
import type {
  VocabularyQuizProps,
  VocabularyMeaning,
  VocabularyItem,
} from "../data-types";
import { Word } from "../types/word";
import { Stat, WordRank } from "../data-types/VocabularyQuizProps";

// interface QuizItem {
//   word: VocabularyItem;
// }

const VocabularyQuiz: React.FC<VocabularyQuizProps> = ({
  vocabulary,
  // availableWords,
  onUpdateRating,
  // onFreezeWord,
  // onDecreaseFreezeCounters,
  // onResetRatings,
  // frozenWords,
}) => {
  const [currentQuizItem, setCurrentQuizItem] = useState<VocabularyItem | null>(
    vocabulary[0]
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

  const generateOptions = (item: VocabularyItem) => {
    if (!item || !item.meanings || !item.word) {
      console.warn("Invalid quiz item provided");
      return;
    }
    console.log(item);
    const correctAnswer = item.meanings
      .map((meaning) => meaning.meaning)
      .join(", ");
    const currentDutchWord = item.word;

    if (!correctAnswer || !currentDutchWord) {
      console.warn("Missing required data in quiz item");
      return;
    }

    // Get all possible wrong answers from all meanings of all words
    // EXCLUDE all meanings from the same Dutch word to avoid confusion
    const allWrongAnswers: string[] = [];
    if (vocabulary && Array.isArray(vocabulary)) {
      vocabulary.forEach((word) => {
        // Skip the current Dutch word entirely
        if (
          word &&
          word.word &&
          word.word !== currentDutchWord &&
          word.meanings &&
          Array.isArray(word.meanings)
        ) {
          word.meanings.forEach((meaning) => {
            if (meaning && meaning.meaning) {
              allWrongAnswers.push(meaning.meaning);
            }
          });
        }
      });
    }

    // Check if we have enough wrong answers
    if (allWrongAnswers.length < 5) {
      console.warn(
        `Not enough wrong answers available. Found ${allWrongAnswers.length}, need 5`
      );
      // If we don't have enough wrong answers, use what we have and pad with empty strings if needed
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
  };

  const selectNewWord = useCallback(
    (index: number = 0) => {
      // console.log("selectNewWord called with shouldFreeze:", shouldFreeze);

      // Safety checks to prevent runtime errors
      if (!vocabulary || vocabulary.length === 0) {
        console.warn("No vocabulary data available");
        return;
      }

      if (index >= vocabulary.length) {
        setIsEndOfList(true);
        return;
      }

      // If no words are available, fall back to any word from vocabulary
      // const wordsToChooseFrom =
      //   availableWords && availableWords.length > 0
      //     ? availableWords
      //     : vocabulary;
      // console.log("Words to choose from:", vocabulary.length);

      // // Create a flat list of all word-meaning combinations with their ratings
      // const allQuizItems: VocabularyItem[] = [];
      // vocabulary.forEach((word) => {
      //   // Safety check for word and meanings
      //   if (word && word.meanings && Array.isArray(word.meanings)) {
      //     word.meanings.forEach((meaning) => {
      //       // Safety check for meaning
      //       if (meaning) {
      //         allQuizItems.push({ ...word });
      //       }
      //     });
      //   }
      // });

      // // Check if we have any quiz items
      // if (allQuizItems.length === 0) {
      //   console.warn("No quiz items available");
      //   return;
      // }

      // // Categorize by rating
      // const newItems = allQuizItems.filter((item) => item.rating === 0);
      // const highRated = allQuizItems.filter(
      //   (item) => item.rating >= 10 && item.rating <= 14
      // );
      // const midRated = allQuizItems.filter(
      //   (item) => item.rating >= 5 && item.rating <= 9
      // );
      // const lowRated = allQuizItems.filter(
      //   (item) => item.rating >= 1 && item.rating <= 4
      // );

      // const random = Math.random();

      const selectedItem: VocabularyItem = { ...vocabulary[index] };

      // if (random < 0.2 && newItems.length > 0) {
      //   // 20% chance for new meanings
      //   selectedItem = newItems[Math.floor(Math.random() * newItems.length)];
      // } else if (random < 0.6 && highRated.length > 0) {
      //   // 40% chance for high-rated meanings (10-14)
      //   selectedItem = highRated[Math.floor(Math.random() * highRated.length)];
      // } else if (random < 0.9 && midRated.length > 0) {
      //   // 30% chance for mid-rated meanings (5-9)
      //   selectedItem = midRated[Math.floor(Math.random() * midRated.length)];
      // } else if (lowRated.length > 0) {
      //   // 10% chance for low-rated meanings (0-4)
      //   selectedItem = lowRated[Math.floor(Math.random() * lowRated.length)];
      // } else {
      //   // Fallback to any item
      //   selectedItem =
      //     allQuizItems[Math.floor(Math.random() * allQuizItems.length)];
      // }

      setCurrentQuizItem(selectedItem);
      generateOptions(selectedItem);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCardFlipped(false);
      setShowChoices(true); // Show choices immediately

      // // Only freeze the word if it's not the initial load
      // if (shouldFreeze) {
      //   onFreezeWord(selectedItem.word.dutch);
      // }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [vocabulary]
  );

  useEffect(() => {
    console.log("useEffect check:", {
      vocabulary: !!vocabulary,
      vocabularyLength: vocabulary?.length,
      isInitialized: isInitialized,
    });

    if (vocabulary && vocabulary.length > 0 && !isInitialized) {
      console.log("Initializing quiz...");
      // Only initialize the first word, don't freeze it yet
      selectNewWord(0);
      setIsInitialized(true);
    }
  }, [vocabulary, isInitialized, selectNewWord]);

  const handleAnswerClick = async (answer: string) => {
    if (selectedAnswer || !currentQuizItem) return;

    setSelectedAnswer(answer);

    // Flip the card to show the translation
    setIsCardFlipped(true);

    // Show result after a short delay to let the flip animation start
    setTimeout(() => {
      setShowResult(true);
    }, 150);

    const isCorrect =
      currentQuizItem.meanings.map((meaning) => meaning.meaning).join(", ") ===
      answer;

    // Update ratings through parent component
    if (isCorrect) {
      setWordsRanks([
        ...wordsRanks,
        { wordId: currentQuizItem.id, rank: currentQuizItem.rating + 1 },
      ]);
      // await onUpdateRating(currentQuizItem.word, currentQuizItem.id, 1);
    } else {
      // await onUpdateRating(currentQuizItem.word, currentQuizItem.id, -3);
      setWordsRanks([
        ...wordsRanks,
        {
          wordId: currentQuizItem.id,
          rank: currentQuizItem.rating > 2 ? currentQuizItem.rating - 3 : 0,
        },
      ]);
    }

    // Update stats
    setStats((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
      knownWords: vocabulary.reduce(
        (count, word) => count + (word.rating === 15 ? 1 : 0), // meanings.filter((meaning) => meaning.rating === 15).length,
        0
      ),
    }));
  };

  const nextWord = async (index: number) => {
    // Decrease freeze counters for all frozen words and wait for completion
    // await onDecreaseFreezeCounters();

    setTimeout(() => {
      selectNewWord(index); // This should freeze the new word
    }, 1000);
  };

  const resetQuiz = async () => {
    // await onResetRatings();
    setStats({ correct: 0, incorrect: 0, knownWords: 0 });
    setIsInitialized(false);
    setIsCardFlipped(false);
    setShowChoices(false);
    setShowResult(false);
    setIsEndOfList(false);
    setWordsRanks([]);
    setTimeout(() => {
      if (vocabulary.length > 0) {
        selectNewWord(0); // Don't freeze on reset
        setIsInitialized(true);
      }
    }, 100);
  };

  const getOptionClass = (option: string) => {
    if (!showResult) {
      return "px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer text-lg font-medium";
    }

    if (
      currentQuizItem?.meanings.map((meaning) => meaning.meaning).join(", ") ===
      option
    ) {
      return "px-6 py-4 bg-green-100 border-2 border-green-500 rounded-lg text-lg font-medium text-green-800";
    } else if (option === selectedAnswer) {
      return "px-6 py-4 bg-red-100 border-2 border-red-500 rounded-lg text-lg font-medium text-red-800";
    } else {
      return "px-6 py-4 bg-gray-100 border-2 border-gray-300 rounded-lg text-lg font-medium text-gray-600";
    }
  };

  const getTotalKnownWords = () => {
    return vocabulary.reduce(
      (count, word) => count + (word.rating === 15 ? 1 : 0),
      0
    );
  };

  if (!currentQuizItem || !vocabulary || vocabulary.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  const handleContainerClick = () => {
    const index = vocabulary.findIndex(
      (item) => item.id === currentQuizItem.id
    );
    if (showResult) {
      nextWord(index + 1);
    }
  };

  const handleUpdateResult = async () => {
    await onUpdateRating(wordsRanks);
    resetQuiz();
  };

  const flipCardStyle = {
    backgroundColor: "transparent",
    perspective: "1000px",
    width: "286px", // Standard card ratio 5:7 (400px * 5/7 ≈ 286px)
    height: "400px",
    margin: "0 auto", // Center the card
  };

  const flipCardInnerStyle = {
    position: "relative" as const,
    width: "100%",
    height: "100%",
    textAlign: "center" as const,
    transition: "transform 0.6s",
    transformStyle: "preserve-3d" as const,
    transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
  };

  const cardSideBaseStyle = {
    position: "absolute" as const,
    width: "100%",
    height: "100%",
    WebkitBackfaceVisibility: "hidden" as const,
    backfaceVisibility: "hidden" as const,
    borderRadius: "16px",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  const frontCardStyle = {
    ...cardSideBaseStyle,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    cursor: "default", // Not clickable anymore
  };

  const backCardStyle = {
    ...cardSideBaseStyle,
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    transform: "rotateY(180deg)",
    cursor: showResult ? "default" : "pointer",
  };

  return (
    <div
      className={`max-w-4xl mx-auto ${showResult ? "cursor-pointer" : ""}`}
      onClick={showResult ? handleContainerClick : undefined}
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-700">
            {stats.correct}
          </div>
          <div className="text-sm text-green-600">Correct</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-red-700">
            {stats.incorrect}
          </div>
          <div className="text-sm text-red-600">Incorrect</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">
            {getTotalKnownWords()}
          </div>
          <div className="text-sm text-blue-600">Known Meanings</div>
        </div>
      </div>

      {!isEndOfList && (
        <>
          {/* Flipping Card */}
          <div className="mb-6" style={flipCardStyle}>
            <div style={flipCardInnerStyle}>
              {/* Front of card - Dutch word */}
              <div style={frontCardStyle}>
                <div className="text-center">
                  <div className="text-6xl font-bold">
                    {currentQuizItem.word}
                  </div>
                </div>
              </div>

              {/* Back of card - English meaning */}
              <div style={backCardStyle}>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {currentQuizItem.meanings
                      ?.map((meaning) => meaning.meaning)
                      .join(", ")}
                  </div>
                  <div className="text-lg opacity-90 mb-2">
                    ({currentQuizItem.partOfSpeech})
                  </div>
                  {/* <div className="text-base opacity-80 italic">
                {currentQuizItem.meaning.context}
              </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Context Hint */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-amber-700 font-medium mb-1">
                Context Hint:
              </div>
              <div className="text-amber-800 italic text-lg">
                {/* {currentQuizItem.meaning.context} */}
              </div>
              <div className="text-amber-600 text-sm mt-1">
                {/* ({currentQuizItem.meaning.partOfSpeech}) */}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="text-center text-gray-700">
              {!showResult && (
                <p className="text-lg font-medium text-indigo-700">
                  What does "{currentQuizItem.word}" mean in English?
                </p>
              )}
            </div>
          </div>

          {/* Multiple Choice Options */}
          {showChoices && (
            <div
              className={`transition-all duration-500 ${
                showChoices
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="grid grid-cols-2 gap-4 mb-6">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      if (!showResult) {
                        e.stopPropagation();
                        handleAnswerClick(option);
                      }
                    }}
                    disabled={showResult}
                    className={getOptionClass(option)}
                    style={showResult ? { pointerEvents: "none" } : {}}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result and Examples */}
          {showResult && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-500 hover:shadow-xl">
              <div className="text-center mb-4">
                <div
                  className={`text-2xl font-bold mb-2 ${
                    currentQuizItem.meanings
                      ?.map((meaning) => meaning.meaning)
                      .join(", ") === selectedAnswer
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {currentQuizItem.meanings
                    ?.map((meaning) => meaning.meaning)
                    .join(", ") === selectedAnswer
                    ? "🎉 Correct!"
                    : "❌ Incorrect"}
                </div>
                <div className="text-gray-600 text-lg italic">
                  {/* {currentQuizItem.meaning.context} */}
                </div>
              </div>

              {/* Examples */}
              {currentQuizItem.meanings[0]?.example &&
                currentQuizItem.meanings[0]?.exampleTranslation && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                      Examples:
                    </h4>
                    {currentQuizItem.meanings?.map((example, index) => (
                      <div key={index} className="mb-3 last:mb-0">
                        <div className="text-indigo-700 font-medium">
                          🇳🇱 {example.example}
                        </div>
                        <div className="text-gray-600">
                          🇬🇧 {example.exampleTranslation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Show other meanings if available */}
              {/* {currentQuizItem.meanings?.length > 1 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-800 mb-3 text-lg">
                Other meanings of "{currentQuizItem.word}":
              </h4>
              {currentQuizItem.meanings
                // .filter((_, index) => index !== currentQuizItem.meaningIndex)
                ?.map((meaning, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <span className="font-medium text-blue-700">
                      {meaning.meaning}
                    </span>
                    <span className="text-blue-600 ml-2">
                      ({currentQuizItem.partOfSpeech})
                    </span>
                    <span className="text-blue-500 ml-2">
                      - {meaning.context}
                    </span>
                  </div>
                ))}
            </div>
          )} */}

              {/* Click to continue indicator */}
              <div className="text-center text-gray-500 mt-6">
                <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full">
                  <span>👆</span>
                  <span>
                    Click anywhere in this area to continue to next word
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Reset Button */}
      <div className="flex flex-col items-center gap-2 w-full ">
        {isEndOfList && (
          <button
            onClick={handleUpdateResult}
            className="px-6 py-3 bg-blue-200 text-gray-700 rounded-lg hover:bg-blue-100 transition-colors font-medium max-w-48"
          >
            Apply progress
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering next word when clicking reset
            resetQuiz();
          }}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium max-w-48"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
};

export default VocabularyQuiz;
