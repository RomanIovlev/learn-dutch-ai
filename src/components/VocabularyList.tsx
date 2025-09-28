import React, { useState, useEffect, useCallback } from "react";
import type { VocabularyListProps, VocabularyItem } from "../data-types";
import { useUserWords } from "../hooks/useUserWords";
import { PartOfSpeech } from "../types/word";
import {
  ALL_PARTS_OF_SPEECH,
  filterVocabularyItems,
} from "./vocabulary-config";
import { Search, X, Plus, Trash2 } from "lucide-react";

const VocabularyList: React.FC<VocabularyListProps> = ({ userId }) => {
  const { userVocabulary, allWords, isLoading, handleUpdateUserVocabulary } =
    useUserWords(userId);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"alphabetical" | "rating">(
    "alphabetical"
  );
  const [wordsToAdd, setWordsToAdd] = useState<number[]>([]);
  const [userWordsToDelete, setUserWordsToDelete] = useState<number[]>([]);
  const [wordPartOfSpeech, setWordPartOfSpeech] = useState<
    PartOfSpeech | "all"
  >("all");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleSetSelectedCard = useCallback((index: number | null) => {
    setSelectedCard(index);
  }, []);

  // Pre-calculate the vocabularies to use in useEffect
  const filteredUserVocabulary =
    userVocabulary && Array.isArray(userVocabulary)
      ? userVocabulary.filter((item) => filterVocabularyItems(item, searchTerm))
      : [];

  const filteredAllWords = (
    wordPartOfSpeech !== "all"
      ? allWords.filter((word) => word.partOfSpeech === wordPartOfSpeech)
      : [...allWords]
  )
    .filter((item) => filterVocabularyItems(item, searchTerm))
    .filter(
      (item) => !userVocabulary.find((userWord) => userWord.id === item.id)
    );

  const sortedUserVocabulary =
    wordPartOfSpeech !== "all"
      ? filteredUserVocabulary.filter(
          (word) => word.partOfSpeech === wordPartOfSpeech
        )
      : [...filteredUserVocabulary].sort((a, b) => {
          if (sortBy === "rating") {
            // Sort by highest rating among all meanings
            const aMaxRating = a.rating;
            const bMaxRating = b.rating;
            return bMaxRating - aMaxRating;
          }
          return (a.word || "").localeCompare(b.word || "");
        });

  // Early return if vocabulary is not available
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center p-8">
          <div className="text-xl text-gray-600">Loading vocabulary...</div>
        </div>
      </div>
    );
  }

  // Calculate stats for all meanings
  const calculateStats = () => {
    let knownMeanings = 0;
    let strongMeanings = 0;
    let learningMeanings = 0;
    let weakMeanings = 0;
    let newMeanings = 0;

    // Safety check for vocabulary
    if (userVocabulary && Array.isArray(userVocabulary)) {
      userVocabulary.forEach((word) => {
        if (word.rating === 15) knownMeanings++;
        else if (word.rating >= 10) strongMeanings++;
        else if (word.rating >= 5) learningMeanings++;
        else if (word.rating >= 1) weakMeanings++;
        else newMeanings++;
      });
    }

    return {
      knownMeanings,
      strongMeanings,
      learningMeanings,
      weakMeanings,
      newMeanings,
    };
  };

  const stats = calculateStats();

  const handleAddWord = (wordId: number) => {
    setWordsToAdd(
      wordsToAdd.includes(wordId)
        ? wordsToAdd.filter((id) => id !== wordId)
        : [...wordsToAdd, wordId]
    );
  };

  const handleDeleteWord = (wordId: number) => {
    setUserWordsToDelete(
      userWordsToDelete.includes(wordId)
        ? userWordsToDelete.filter((id) => id !== wordId)
        : [...userWordsToDelete, wordId]
    );
  };

  const handleChangeUserVocabulary = async () => {
    await handleUpdateUserVocabulary(wordsToAdd, userWordsToDelete);
    setUserWordsToDelete([]);
    setWordsToAdd([]);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Stats Dashboard */}
      <div className="bg-gradient-to-br from-white via-indigo-50 to-blue-50 rounded-2xl shadow-2xl border border-indigo-100 p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🎯 Learning Progress
          </h2>
          <p className="text-indigo-600/70 text-sm">
            Track your Dutch vocabulary mastery
          </p>
        </div>
        <div className="grid grid-cols-5 gap-6 text-center">
          <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1">
              {stats.knownMeanings}
            </div>
            <div className="text-emerald-100 text-sm font-medium">
              ✨ Mastered
            </div>
            <div className="w-full h-1 bg-emerald-200 rounded-full mt-3">
              <div
                className="h-full bg-white rounded-full opacity-60"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1">
              {stats.strongMeanings}
            </div>
            <div className="text-blue-100 text-sm font-medium">🔥 Strong</div>
            <div className="w-full h-1 bg-blue-200 rounded-full mt-3">
              <div
                className="h-full bg-white rounded-full opacity-60"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1">
              {stats.learningMeanings}
            </div>
            <div className="text-yellow-100 text-sm font-medium">
              📈 Learning
            </div>
            <div className="w-full h-1 bg-yellow-200 rounded-full mt-3">
              <div
                className="h-full bg-white rounded-full opacity-60"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-red-400 p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1">
              {stats.weakMeanings}
            </div>
            <div className="text-orange-100 text-sm font-medium">
              🌱 Practicing
            </div>
            <div className="w-full h-1 bg-orange-200 rounded-full mt-3">
              <div
                className="h-full bg-white rounded-full opacity-60"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-400 to-gray-500 p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1">
              {stats.newMeanings}
            </div>
            <div className="text-slate-100 text-sm font-medium">🆕 Fresh</div>
            <div className="w-full h-1 bg-slate-200 rounded-full mt-3">
              <div
                className="h-full bg-white rounded-full opacity-60"
                style={{ width: "5%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="🔍 Search vocabulary... (try 'appel' or 'apple')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white placeholder-gray-400"
            />
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-indigo-400" />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSortBy("alphabetical")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                sortBy === "alphabetical"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">📝</span>
              A-Z
            </button>
            <button
              onClick={() => setSortBy("rating")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                sortBy === "rating"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">⭐</span>
              Rating
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            📚 Vocabulary Collection
          </h2>
          <p className="text-gray-500 mt-1">
            {sortedUserVocabulary.length} words •{" "}
            {sortedUserVocabulary.length !== userVocabulary.length
              ? `${userVocabulary.length} filtered`
              : "All words"}
          </p>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></span>
            <span>Click cards for details</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 my-4">
        {[...ALL_PARTS_OF_SPEECH, "all"].map((part) => (
          <button
            key={part}
            className={`capitalize px-2 rounded-xl border border-blue-500 ${
              part === wordPartOfSpeech ? "text-white" : "text-blue-500"
            } ${
              part === wordPartOfSpeech
                ? "bg-gradient-to-r from-indigo-400 to-blue-500"
                : "bg-white"
            }`}
            onClick={() => setWordPartOfSpeech(part as PartOfSpeech | "all")}
          >
            {part}
          </button>
        ))}
      </div>

      {/* Vocabulary Grid with proper containment */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedUserVocabulary.map((item, index) => (
            <VocabularyItemCard
              key={item.id}
              index={index}
              item={item}
              wordsToDelete={userWordsToDelete}
              onDeleteWord={handleDeleteWord}
              selectedCard={selectedCard}
              setSelectedCard={handleSetSelectedCard}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent my-4">
          📚 All vocabulary words
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAllWords.map((item, index) => (
            <VocabularyItemCard
              key={item.id}
              index={index}
              item={item}
              wordsToAdd={wordsToAdd}
              onAddWord={handleAddWord}
              selectedCard={selectedCard}
              setSelectedCard={handleSetSelectedCard}
            />
          ))}
        </div>
        {(wordsToAdd.length > 0 || userWordsToDelete.length > 0) && (
          <div className="fixed py-4 px-6 bottom-0 left-0 right-0 z-[9999] border-t-2 border-indigo-200 bg-gradient-to-br from-white via-indigo-50 to-blue-50 shadow-2xl backdrop-blur-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-center">
              <button
                onClick={handleChangeUserVocabulary}
                className={`border-2 border-blue-300  flex items-center gap-3 px-6 py-3 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                {wordsToAdd.length > 0 && (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>
                      Add {wordsToAdd.length} word
                      {wordsToAdd.length === 1 ? "" : "s"} to vocabulary
                    </span>
                    <div className="bg-indigo-300 px-2 py-1 rounded-full text-sm font-bold">
                      {wordsToAdd.length}
                    </div>
                  </>
                )}

                {userWordsToDelete.length > 0 && (
                  <>
                    <Trash2 className="w-5 h-5" />
                    <span>
                      Remove {userWordsToDelete.length} word
                      {userWordsToDelete.length === 1 ? "" : "s"} from
                      vocabulary
                    </span>
                    <div className="bg-indigo-300 px-2 py-1 rounded-full text-sm font-bold">
                      {userWordsToDelete.length}
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {sortedUserVocabulary.length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No words found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? (
              <>
                No vocabulary words found matching "
                <span className="font-medium text-indigo-600">
                  {searchTerm}
                </span>
                "
              </>
            ) : (
              "No vocabulary words available"
            )}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabularyList;

const VocabularyItemCard = ({
  item,
  index,
  onDeleteWord,
  wordsToDelete,
  wordsToAdd,
  onAddWord,
  selectedCard,
  setSelectedCard,
}: {
  item: VocabularyItem;
  index: number;
  wordsToDelete?: number[];
  onDeleteWord?: (wordId: number) => void;
  wordsToAdd?: number[];
  onAddWord?: (wordId: number) => void;
  selectedCard: number | null;
  setSelectedCard: (index: number | null) => void;
}) => {
  const [popupPosition, setPopupPosition] = useState({
    x: 0,
    y: 0,
    direction: "right",
  });
  const switchingRef = React.useRef(false);
  // Determine if popup should appear on left or right side
  const getPopupDirection = (cardElement: HTMLButtonElement) => {
    const rect = cardElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popupWidth = 448; // max-w-[28rem] = 448px

    // Check if there's enough space to the right
    const spaceRight = viewportWidth - rect.right;
    const spaceLeft = rect.left;

    // Prefer right side, but use left if not enough space on right and more space on left
    if (spaceRight < popupWidth + 32 && spaceLeft > spaceRight) {
      return "left";
    }
    return "right";
  };

  const handleCardClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Always close current popup first
    if (selectedCard === item.id) {
      // Close popup if clicking the same card
      setSelectedCard(null);
    } else {
      // Store the element reference and set switching flag
      const cardElement = event.currentTarget;
      const direction = getPopupDirection(cardElement);
      switchingRef.current = true;

      // Close any open popup and open new one
      setSelectedCard(null);
      // Use setTimeout to ensure the state update completes before opening new popup
      setTimeout(() => {
        setPopupPosition({ x: 0, y: 0, direction });
        setSelectedCard(item.id);
        switchingRef.current = false;
      }, 0);
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if we're in the middle of switching cards
      if (switchingRef.current) return;

      // Check if click is outside both the card and the popup
      if (
        selectedCard !== null &&
        !target.closest("[data-card-details]") &&
        !target.closest("[data-card-container]")
      ) {
        setSelectedCard(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedCard, setSelectedCard]);

  const getRatingColor = (rating: number = 0) => {
    if (rating === 15) return "bg-green-100 text-green-800 border-green-200";
    if (rating >= 10) return "bg-blue-100 text-blue-800 border-blue-200";
    if (rating >= 5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (rating >= 1) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getRatingLabel = (rating: number = 0) => {
    if (rating === 15) return "✨ Known";
    if (rating >= 10) return "🔥 Strong";
    if (rating >= 5) return "📈 Learning";
    if (rating >= 1) return "🌱 Weak";
    return "🆕 New";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fruits":
        return "🍎";
      case "common":
        return "⭐";
      default:
        return "📖";
    }
  };

  const getWordCategories = (item: VocabularyItem) => {
    if (!item) {
      return ["unknown"]; // Fallback category
    }
    const categories = Array.from(new Set(item.category || "unknown"));
    return categories;
  };

  // Simplified safety checks
  if (!item?.meanings?.[0]?.meaning) {
    return null;
  }

  const primaryMeaning = item.meanings[0];
  const maxRating = Math.max(item.rating, 0);
  // TODO do smth with categories
  const categories = getWordCategories(item);

  return (
    <div
      className={`bg-gradient-to-br from-white to-gray-50 rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300 relative cursor-pointer transform hover:-translate-y-1 border overflow-visible group ${
        wordsToDelete?.includes(item.id)
          ? "border-red-300 bg-red-50/50"
          : wordsToAdd?.includes(item.id)
          ? "border-green-300 bg-green-50/50"
          : "border-gray-100"
      } ${
        selectedCard === item.id ? "z-[9998] ring-indigo-400 shadow-xl" : "z-10"
      }`}
      data-card-details
    >
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          wordsToDelete?.includes(item.id)
            ? "bg-gradient-to-r from-red-400 via-red-500 to-red-600"
            : wordsToAdd?.includes(item.id)
            ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600"
            : "bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-500"
        }`}
      ></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent mb-1">
              {item.word}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 ml-2">
            {/* Add/Remove from wordsToAdd - only show if not in wordsToDelete */}
            {wordsToAdd && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddWord?.(item.id);
                }}
                className={`p-2 rounded-full transition-all duration-200 ${
                  wordsToAdd?.includes(item.id)
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"
                }`}
                title={
                  wordsToAdd?.includes(item.id)
                    ? "Remove from add list"
                    : "Add to add list"
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            {/* Delete button - only show if not in wordsToAdd */}
            {wordsToDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteWord?.(item.id);
                }}
                className={`p-2 rounded-full transition-all duration-200 ${
                  wordsToDelete?.includes(item.id)
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                }`}
                title={
                  wordsToDelete?.includes(item.id)
                    ? "Remove from delete list"
                    : "Add to delete list"
                }
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Click hint */}
        <button
          onClick={(event) => {
            event.stopPropagation();
            handleCardClick(event);
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium pointer-events-auto"
        >
          {selectedCard === item.id ? "Click to close" : "Click for details"}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-2">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-500"
          style={{ width: `${(maxRating / 15) * 100}%` }}
        ></div>
      </div>

      {/* Enhanced Click Popover */}
      {selectedCard === item.id && (
        <div
          className={`absolute z-[9999] bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-2xl p-6 min-w-96 max-w-[28rem] backdrop-blur-sm animate-in fade-in duration-200 ${
            popupPosition.direction === "left"
              ? "right-full top-0 mr-4"
              : "left-full top-0 ml-4"
          }`}
          style={{
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
          data-card-container
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              setSelectedCard(null);
            }}
            className="absolute top-2 right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors text-gray-600 hover:text-gray-800 z-10"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>

          <div
            className={`absolute top-6 w-4 h-4 bg-gradient-to-br from-white to-blue-50 border-2 border-indigo-200 transform rotate-45 ${
              popupPosition.direction === "left"
                ? "-right-2 border-r-0 border-b-0"
                : "-left-2 border-l-0 border-t-0"
            }`}
          ></div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{getCategoryIcon(item.category)}</span>
              <h4 className="font-bold text-lg bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                {item.word}
              </h4>
            </div>

            <div className="space-y-4">
              {item.meanings.map((meaning, meaningIndex) => (
                <div
                  key={meaningIndex}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 hover:bg-white/90 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-800 text-lg">
                      {meaning.meaning}
                    </span>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getRatingColor(
                        item.rating
                      )}`}
                    >
                      {item.rating}/15
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                      {item.partOfSpeech}
                    </span>
                    {meaning.context && (
                      <span className="italic">{meaning.context}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-100">
                      {meaning.example && (
                        <div className="text-indigo-700 font-semibold mb-1 text-sm">
                          🇳🇱 {meaning.example}
                        </div>
                      )}
                      {meaning.exampleTranslation && (
                        <div className="text-gray-700 text-sm">
                          🇬🇧 {meaning.exampleTranslation}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-500"
                      style={{
                        width: `${(item.rating / 15) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
