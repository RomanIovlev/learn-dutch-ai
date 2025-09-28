import { useEffect, useState } from "react";
import { VocabularyItem } from "../data-types";
import { WordRank } from "../data-types/VocabularyQuizProps";
import {
  getUserQuizWords,
  prepareWord,
  prepareWordExtended,
  updateUserWordsRank,
} from "../services/words-service";

export const useUserQuizWords = (
  userId: number,
  isExtendedWords: boolean = false
) => {
  const [quizWords, setQuizWords] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuizWords = () =>
    getUserQuizWords(userId, 15)
      .then((data) => {
        const words = (data || [])
          .map(isExtendedWords ? prepareWordExtended : prepareWord)
          .sort((a, b) => a.id - b.id);
        setQuizWords(words);
      })
      .finally(() => {
        setIsLoading(false);
      });

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetchQuizWords();
  }, [userId]);

  const onUpdateUserWordsRanks = async (items: WordRank[]) => {
    const apiItems = items.map((item) => ({
      word_id: item.wordId,
      rank: item.rank,
    }));
    const result = await updateUserWordsRank(userId, apiItems);
    if (!result || !result.length) return;

    await fetchQuizWords();
  };

  return { quizWords, onUpdateUserWordsRanks, isLoading };
};
