import { useEffect, useState } from "react";
import { VocabularyItem } from "../data-types";
import {
  getUserWords,
  prepareWord,
  getAllWords,
  addUserWords,
  deleteUserWords,
} from "../services/words-service";

export const useUserWords = (userId: number) => {
  const [userVocabulary, setUserVocabulary] = useState<VocabularyItem[]>([]);
  const [allWords, setAllWords] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserWords = () =>
    getUserWords(userId)
      .then((data) => {
        const words = (data || []).map(prepareWord);
        setUserVocabulary(words);
      })
      .finally(() => {
        setIsLoading(false);
      });

  const fetchAllUserWords = () =>
    getAllWords()
      .then((data) => {
        const words = (data || []).map(prepareWord);
        setAllWords(words);
      })
      .finally(() => {
        setIsLoading(false);
      });

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchUserWords();
    fetchAllUserWords();
  }, [userId]);

  const handleUpdateUserVocabulary = async (
    wordsToAdd: number[],
    wordsToDelete: number[]
  ) => {
    if (wordsToAdd.length > 0) {
      await addUserWords(userId, wordsToAdd);
    }
    if (wordsToDelete.length > 0) {
      await deleteUserWords(userId, wordsToDelete);
    }
    await fetchUserWords();
  };

  return { userVocabulary, allWords, isLoading, handleUpdateUserVocabulary };
};
