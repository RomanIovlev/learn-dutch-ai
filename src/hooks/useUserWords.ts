import { useEffect, useState } from "react";
import { VocabularyItem } from "../data-types";
import { Word } from "../types/word";
import { WordRank } from "../data-types/VocabularyQuizProps";

// TODO move to service
export const getUserWords = (userId: number): Promise<Word[]> =>
  fetch(`http://localhost:8000/api/v1/words/app-user/${userId}`).then(
    (response) => response.json()
  );

interface APIWordRank {
  word_id: number;
  rank: number;
}
export const updateUserWords = (
  userId: number,
  items: APIWordRank[]
): Promise<APIWordRank[]> =>
  fetch(`http://localhost:8000/api/v1/words/app-user/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ items }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const useUserWords = (userId: number) => {
  const [wordList, setWordList] = useState<Word[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  //   const [availableWords, setAvailableWords] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      return;
    }
    getUserWords(userId)
      .then((data) => {
        // setWordList(data);
        const words = (data || [])
          .map((word) => ({
            word: word.word,
            id: word.id,
            partOfSpeech: word.part_of_speech,
            rating: word.rank,
            category: word.category,
            meanings: word.meanings.map((meaning) => ({
              meaning: meaning.meaning,
              context: meaning.usage ?? "",
              example: meaning.example ?? "",
              exampleTranslation: meaning.example_translation ?? "",
            })),
          }))
          .sort((a, b) => a.id - b.id);
        setVocabulary(words);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  const onUpdateUserWordsRanks = async (items: WordRank[]) => {
    console.log(items);
    const apiItems = items.map((item) => ({
      word_id: item.wordId,
      rank: item.rank,
    }));
    const result = await updateUserWords(userId, apiItems);
    console.log(result);
    if (!result || !result.length) return;
    const resultMap = result.reduce((accumulator, currentValue) => {
      return { ...accumulator, [currentValue.word_id]: currentValue.rank };
    }, {} as Record<number, number>);
    const newVocabulary = vocabulary.map((item) => ({
      ...item,
      rating: resultMap[item.id] ? resultMap[item.id] : item.rating,
    }));
    setVocabulary(newVocabulary);
  };

  return { wordList, vocabulary, onUpdateUserWordsRanks };
};
// export interface VocabularyMeaning {
//   english: string;
//   examples: Array<{ nl: string; en: string }>;
//   context: string;
//   partOfSpeech: string;
//   category: string;
//   rating: number;
// }

// export interface VocabularyItem {
//   dutch: string;
//   meanings: VocabularyMeaning[];
// }
