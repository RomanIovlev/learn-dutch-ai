import { Word } from "../types/word";

const WORD_API_URL = "http://localhost:8000/api/v1/words";

export const getUserQuizWords = (
  userId: number,
  limit: number
): Promise<Word[]> =>
  fetch(`${WORD_API_URL}/app-user/${userId}?limit=${limit}`).then((response) =>
    response.json()
  );

export const getUserWords = (userId: number): Promise<Word[]> =>
  fetch(`${WORD_API_URL}/app-user/${userId}`).then((response) =>
    response.json()
  );

export interface APIWordRank {
  word_id: number;
  rank: number;
}

export const updateUserWordsRank = (
  userId: number,
  items: APIWordRank[]
): Promise<APIWordRank[]> =>
  fetch(`${WORD_API_URL}/app-user/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ items }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const addUserWords = (
  userId: number,
  words: number[]
): Promise<Word[]> =>
  fetch(`${WORD_API_URL}/list/${userId}`, {
    method: "POST",
    body: JSON.stringify({ words }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const deleteUserWords = (
  userId: number,
  words: number[]
): Promise<Word[]> =>
  fetch(`${WORD_API_URL}/list/${userId}`, {
    method: "DELETE",
    body: JSON.stringify({ words }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const getAllWords = (): Promise<Word[]> =>
  fetch(`${WORD_API_URL}/list`).then((response) => response.json());

export const prepareWord = (word: Word) => ({
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
});
