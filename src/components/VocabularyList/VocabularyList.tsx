import React, { useState, useCallback } from "react";
import type { VocabularyListProps } from "../../data-types";
import { useUserWords } from "../../hooks/useUserWords";
import { PartOfSpeech } from "../../types/word";
import { filterVocabularyItems } from "../vocabulary-config";
import VocabularyItemCard from "./VocabularyItemCard";
import EmptyState from "../EmptyState";
import VocabularyActionsBar from "./VocabularyActionsBar";
import VocabularyStatsDashboard from "./VocabularyStatsDashboard";
import { SortOption } from "../../types/vocabulary";
import VocabularySearchAndSort from "./VocabularySearchAndSort";
import Loading from "../Loading";
import { VocabularyPartOfSpeech } from "./VocabularyPartOfSpeech";

const VocabularyList: React.FC<VocabularyListProps> = ({ userId }) => {
  const { userVocabulary, allWords, isLoading, handleUpdateUserVocabulary } =
    useUserWords(userId, true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
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
    return <Loading message={"Loading vocabulary..."} />;
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
      <VocabularyStatsDashboard stats={stats} />

      {/* Search and Sort Controls */}
      <VocabularySearchAndSort
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearSearch={() => setSearchTerm("")}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div
        className="mb-6 flex items-center justify-between"
        data-testid="vocabulary-stats"
      >
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            📚 Vocabulary Collection
          </h2>
          <p className="text-secondary mt-1">
            {sortedUserVocabulary.length} words •{" "}
            {sortedUserVocabulary.length !== userVocabulary.length
              ? `${userVocabulary.length} filtered`
              : "All words"}
          </p>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center gap-2 text-sm text-secondary">
            <span className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></span>
            <span>Click cards for details</span>
          </div>
        </div>
      </div>

      <VocabularyPartOfSpeech
        wordPartOfSpeech={wordPartOfSpeech}
        onSetWordPartOfSpeech={setWordPartOfSpeech}
      />

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

        <VocabularyActionsBar
          wordsToAdd={wordsToAdd}
          userWordsToDelete={userWordsToDelete}
          onSubmit={handleChangeUserVocabulary}
        />
      </div>

      {sortedUserVocabulary.length === 0 && (
        <EmptyState
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
        />
      )}
    </div>
  );
};

export default VocabularyList;
