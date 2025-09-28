import { VocabularyItem } from "../data-types";
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

export const prepareWordExtended = (word: Word): VocabularyItem => ({
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

export const prepareWord = (word: Word): VocabularyItem => ({
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
