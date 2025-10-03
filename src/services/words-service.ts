import { VocabularyItem } from "../data-types";
import { ExampleSentenceFromAPI, Word } from "../types/word";

const WORD_API_URL = "http://localhost:8000/api/v1/words";

// Common headers for API requests
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const;

// Helper function to append limit parameter to URL
const addLimit = (limit: number): string =>  limit > 0 ? `?limit=${limit}` : '';

// Helper function for endpoints with minimum limit of 1
const addValidatedLimit = (limit: number): string => {
  const validLimit = Math.max(1, Math.min(100, limit));
  return validLimit > 1 ? `?limit=${validLimit}` : '';
};

// Generic fetch wrapper with error handling
const apiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: { ...DEFAULT_HEADERS, ...options.headers },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const getUserQuizWords = async (
  userId: number,
  limit: number
): Promise<APIWord[]> => {
  const url = `${WORD_API_URL}/list-selected/${userId}` + addLimit(limit);
  return apiRequest<APIWord[]>(url);
};

export const getUserWords = async (userId: number, limit: number = 0): Promise<APIWord[]> => {
  const url = `${WORD_API_URL}/app-user/${userId}` + addLimit(limit);
  return apiRequest<APIWord[]>(url);
};

export interface APIWordRank {
  meaning_id: number;
  rank: number;
}

// API Schema interfaces matching the swagger spec
export interface BatchSetRanks {
  items: APIWordRank[];
}

export interface AppUserMeanings {
  meanings: number[];
}

export interface SelectedMeaningsUpdate {
  meaning_ids: number[];
  is_selected: boolean;
}

export interface APIWord extends Word {
  // The API now returns the exact format we need, so we can use Word directly
}

export const updateUserWordsRank = async (
  userId: number,
  items: APIWordRank[]
): Promise<APIWordRank[]> => {
  const url = `${WORD_API_URL}/user/${userId}/rank`;
  return apiRequest<APIWordRank[]>(url, {
    method: "PATCH",
    body: JSON.stringify({ items } as BatchSetRanks),
  });
};

export const addUserWords = async (
  userId: number,
  meanings: number[],
  limit: number = 0
): Promise<APIWord[]> => {
  const url = `${WORD_API_URL}/list/${userId}` + addLimit(limit);
  return apiRequest<APIWord[]>(url, {
    method: "POST",
    body: JSON.stringify({ meanings } as AppUserMeanings),
  });
};

export const deleteUserWords = async (
  userId: number,
  meanings: number[],
  limit: number = 0
): Promise<APIWord[]> => {
  const url = `${WORD_API_URL}/list/${userId}` + addLimit(limit);
  return apiRequest<APIWord[]>(url, {
    method: "DELETE",
    body: JSON.stringify({ meanings } as AppUserMeanings),
  });
};

export const getAllWords = async (limit: number = 0): Promise<APIWord[]> => {
  const url = `${WORD_API_URL}/list` + addLimit(limit);
  return apiRequest<APIWord[]>(url);
};

export const getAllCategories = async (): Promise<string[]> => {
  const data = await apiRequest<{ category: string; id: number }[]>(`${WORD_API_URL}/categories`);
  return data.map(item => item.category);
};

export const getExampleSentences = async (
  userId: number,
  limit: number = 10
): Promise<ExampleSentenceFromAPI[]> => {
  const url = `${WORD_API_URL}/sentences-with-user-meanings/${userId}` + addValidatedLimit(limit);
  return apiRequest<ExampleSentenceFromAPI[]>(url);
};

export const getSelectedMeanings = async (
  userId: number,
  limit: number = 10
): Promise<APIWord[]> => {
  const url = `${WORD_API_URL}/list-selected/${userId}` + addValidatedLimit(limit);
  return apiRequest<APIWord[]>(url);
};

export const updateSelectedMeanings = async (
  userId: number,
  meaningIds: number[],
  isSelected: boolean
): Promise<any> => {
  const url = `${WORD_API_URL}/user/${userId}/selected`;
  return apiRequest(url, {
    method: "PATCH",
    body: JSON.stringify({
      meaning_ids: meaningIds,
      is_selected: isSelected,
    } as SelectedMeaningsUpdate),
  });
};

// Helper function to extract meaning IDs from words
export const extractMeaningIdsFromWordIds = (words: VocabularyItem[]): number[] => {
  return words.flatMap(word => word.meanings.map(meaning => meaning.id));
};

// Helper function to extract meaning IDs from single word
export const extractMeaningIdsFromWord = (word: VocabularyItem): number[] => {
  return word.meanings.map(meaning => meaning.id);
};

// Common meaning mapper to reduce duplication
const mapMeaning = (meaning: any) => ({
  id: meaning.id,
  pos: meaning.pos,
  meaning: meaning.meaning,
  usage: meaning.usage,
  example_dutch: meaning.example_dutch,
  example_english: meaning.example_english,
  categories: meaning.categories,
});

// Transform API word format to VocabularyItem format
export const transformApiWordToVocabularyItem = (apiWord: any): VocabularyItem => {
  // Create a single meaning object from the API word data
  const meaning = {
    id: apiWord.id,
    pos: apiWord.pos,
    meaning: apiWord.meaning,
    usage: apiWord.usage,
    example_dutch: apiWord.example_dutch,
    example_english: apiWord.example_english,
    categories: apiWord.categories,
  };

  return {
    word: apiWord.word,
    id: apiWord.id,
    rating: apiWord.rank,
    meanings: [meaning],
    verb: apiWord.verb_form ? {
      infinitive: apiWord.verb_form.infinitive || "",
      present: apiWord.verb_form.present || { ik: "", jij: "", u: "", hij: "", wij: "" },
      past: apiWord.verb_form.past || { sg: "", pl: "" },
      perfect: apiWord.verb_form.perfect || { aux: "", participle: "" },
      isIrregular: apiWord.verb_form.is_irregular,
      isMmodal: apiWord.verb_form.is_modal,
      isStrongVerb: apiWord.verb_form.is_strong_verb,
      isSeparable: apiWord.verb_form.is_separable,
      separablePrefix: apiWord.verb_form.separable_prefix,
    } : undefined,
    noun: apiWord.noun_form ? {
      indefiniteArticle: safeString(apiWord.noun_form.indefinite_article),
      diminutive: safeString(apiWord.noun_form.diminutive),
      plural: safeString(apiWord.noun_form.plural),
      noun: safeString(apiWord.noun_form.noun),
    } : undefined,
    adjective: apiWord.adjective_form ? {
      adjective: safeString(apiWord.adjective_form.base),
      deForm: safeString(apiWord.adjective_form.inflected),
      comparison: safeString(apiWord.adjective_form.comparative),
      superlative: safeString(apiWord.adjective_form.superlative),
    } : undefined,
    numeral: apiWord.numeral_form ? {
      numeral: safeString(apiWord.numeral_form.numeral),
      numericValue: apiWord.numeral_form.numeric_value,
      ordinalForm: safeString(apiWord.numeral_form.ordinal_form),
    } : undefined,
  };
};

// Helper function to safely get string value or empty string
const safeString = (value: string | undefined | null): string => value || "";

export const prepareWordExtended = (word: APIWord): VocabularyItem => ({
  word: word.word,
  id: word.id,
  rating: word.rank,
  meanings: word.meanings.map(mapMeaning),
  verb: word.verb_form ? {
    infinitive: word.verb_form.infinitive || "",
    present: word.verb_form.present || { ik: "", jij: "", u: "", hij: "", wij: "" },
    past: word.verb_form.past || { sg: "", pl: "" },
    perfect: word.verb_form.perfect || { aux: "", participle: "" },
    isIrregular: word.verb_form.is_irregular,
    isMmodal: word.verb_form.is_modal,
    isStrongVerb: word.verb_form.is_strong_verb,
    isSeparable: word.verb_form.is_separable,
    separablePrefix: word.verb_form.separable_prefix,
  } : undefined,
  noun: word.noun_form ? {
    indefiniteArticle: safeString(word.noun_form.indefinite_article),
    diminutive: safeString(word.noun_form.diminutive),
    plural: safeString(word.noun_form.plural),
    noun: safeString(word.noun_form.noun),
  } : undefined,
  adjective: word.adjective_form ? {
    adjective: safeString(word.adjective_form.adjective),
    deForm: safeString(word.adjective_form.de_form),
    comparison: safeString(word.adjective_form.comparison),
    superlative: safeString(word.adjective_form.superlative),
  } : undefined,
  numeral: word.numeral_form ? {
    numeral: safeString(word.numeral_form.numeral),
    numericValue: word.numeral_form.numeric_value,
    ordinalForm: safeString(word.numeral_form.ordinal_form),
  } : undefined,
});

export const prepareWord = (word: APIWord): VocabularyItem => ({
  word: word.word,
  id: word.id,
  rating: word.rank,
  meanings: word.meanings.map(mapMeaning),
});
