import { VocabularyItem } from "../data-types";
import { ExampleSentenceFromAPI, Word, Meaning, PartOfSpeech } from "../types/word";

const WORD_API_URL = "http://localhost:8000/api/v1/words";

export const getUserQuizWords = (
  userId: number,
  limit: number
): Promise<APIWord[]> =>
  fetch(`${WORD_API_URL}/app-user/${userId}?limit=${limit}`).then((response) =>
    response.json()
  );

export const getUserWords = (userId: number): Promise<APIWord[]> =>
  fetch(`${WORD_API_URL}/app-user/${userId}`).then((response) =>
    response.json()
  );

export interface APIWordRank {
  word_id: number;
  rank: number;
}

export interface APIWord extends Word {
  // The API now returns the exact format we need, so we can use Word directly
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
): Promise<APIWord[]> =>
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
): Promise<APIWord[]> =>
  fetch(`${WORD_API_URL}/list/${userId}`, {
    method: "DELETE",
    body: JSON.stringify({ words }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

export const getAllWords = (): Promise<APIWord[]> =>
  fetch(`${WORD_API_URL}/list`).then((response) => response.json());

export const getAllCategories = (): Promise<string[]> =>
  fetch(`${WORD_API_URL}/categories`)
    .then((response) => response.json())
    .then((data) => data.map((item: { category: string; id: number }) => item.category));

export const getExampleSentences = (
  userId: number,
  limit: number = 10
): Promise<ExampleSentenceFromAPI[]> =>
  fetch(
    `${WORD_API_URL}/senetences-with-user-words/${userId}?limit=${limit}`
  ).then((response) => {
    return response.json();
  });

export const prepareWordExtended = (word: APIWord): VocabularyItem => ({
  word: word.word,
  id: word.id,
  rating: word.rank,
  meanings: word.meanings.map((meaning) => ({
    id: meaning.id,
    pos: meaning.pos,
    meaning: meaning.meaning,
    usage: meaning.usage,
    example_dutch: meaning.example_dutch,
    example_english: meaning.example_english,
    categories: meaning.categories,
  })),
  verb: word.verb_form
    ? {
        infinitive: word.verb_form.infinitive || "",
        present: word.verb_form.present || "",
        past: word.verb_form.past || "",
        perfect: word.verb_form.perfect || "",
        isIrregular: word.verb_form.is_irregular,
        isMmodal: word.verb_form.is_modal,
        isStrongVerb: word.verb_form.is_strong_verb,
        isSeparable: word.verb_form.is_separable,
        separablePrefix: word.verb_form.separable_prefix || "",
      }
    : undefined,
  noun: word.noun_form
    ? {
        indefiniteArticle: word.noun_form.indefinite_article || "",
        diminutive: word.noun_form.diminutive || "",
        plural: word.noun_form.plural || "",
        noun: word.noun_form.noun || "",
      }
    : undefined,
  adjective: word.adjective_form
    ? {
        adjective: word.adjective_form.adjective || "",
        deForm: word.adjective_form.de_form || "",
        comparison: word.adjective_form.comparison || "",
        superlative: word.adjective_form.superlative || "",
      }
    : undefined,
  numeral: word.numeral_form
    ? {
        numeral: word.numeral_form.numeral || "",
        numericValue: word.numeral_form.numeric_value,
        ordinalForm: word.numeral_form.ordinal_form || "",
      }
    : undefined,
});

export const prepareWord = (word: APIWord): VocabularyItem => ({
  word: word.word,
  id: word.id,
  rating: word.rank,
  meanings: word.meanings.map((meaning) => ({
    id: meaning.id,
    pos: meaning.pos,
    meaning: meaning.meaning,
    usage: meaning.usage,
    example_dutch: meaning.example_dutch,
    example_english: meaning.example_english,
    categories: meaning.categories,
  })),
});
