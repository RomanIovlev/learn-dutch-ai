import { useEffect, useState } from "react";
import { VocabularyItem } from "../data-types";
import {
  getUserWords,
  prepareWord,
  getAllWords,
  addUserWords,
  deleteUserWords,
  prepareWordExtended,
  getAllCategories,
} from "../services/words-service";

export const useUserWords = (
  userId: number,
  isExtendedWords: boolean = false
) => {
  const [userVocabulary, setUserVocabulary] = useState<VocabularyItem[]>([]);
  const [allWords, setAllWords] = useState<VocabularyItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserWords = () =>
    getUserWords(userId)
      .then((data) => {
        const words = (data || []).map(
          isExtendedWords ? prepareWordExtended : prepareWord
        );
        // Deduplicate by ID - keep the first occurrence of each word
        const uniqueWords = words.filter((word, index, array) => 
          array.findIndex(w => w.id === word.id) === index
        );
        setUserVocabulary(uniqueWords);
      })
      .catch((error) => {
        console.error("Error fetching user words:", error);
        setUserVocabulary([]);
      })
      .finally(() => {
        setIsLoading(false);
      });

  const fetchAllUserWords = () =>
    getAllWords()
      .then((data) => {
        const words = (data || []).map(prepareWord);
        // Deduplicate by ID - keep the first occurrence of each word
        const uniqueWords = words.filter((word, index, array) => 
          array.findIndex(w => w.id === word.id) === index
        );
        setAllWords(uniqueWords);
      })
      .catch((error) => {
        console.error("Error fetching all words:", error);
        setAllWords([]);
      })
      .finally(() => {
        setIsLoading(false);
      });

  const fetchCategories = () =>
    getAllCategories()
      .then((data) => {
        setCategories(data || []);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      });

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchUserWords();
    fetchAllUserWords();
    fetchCategories();
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

  return { userVocabulary, allWords, categories, isLoading, handleUpdateUserVocabulary };
};
