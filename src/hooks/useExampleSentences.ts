import { useEffect, useState } from "react";
import { ExampleSentence } from "../types/vocabulary";
import { getExampleSentences } from "../services/words-service";

export const useExampleSentences = (userId: number) => {
  const [examples, setExamples] = useState<ExampleSentence[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSentences = async () => {
    setIsLoading(true);
    return getExampleSentences(userId)
      .then((data) => {
        const newExamples = (data || []).map((word) => ({
          wordId: word.word_id,
          word: word.word,
          exampleSentence: word.example_sentence,
        }));

        setExamples(newExamples);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    // fetchSentences();
  }, [userId]);

  return { examples, isLoading, fetchSentences };
};
