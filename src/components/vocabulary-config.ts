import { VocabularyItem } from "../data-types";
import { PartOfSpeech } from "../types/word";

export const ALL_PARTS_OF_SPEECH: PartOfSpeech[] = [
  "verb",
  "pronoun",
  "noun",
  "adjective",
  "conjunction",
  "adverb",
  "numeral",
  "article",
];

export const filterVocabularyItems = (
  item: VocabularyItem,
  searchTerm: string
) =>
  item &&
  item.word &&
  (item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.meanings &&
      Array.isArray(item.meanings) &&
      item.meanings.some(
        (meaning) =>
          meaning &&
          meaning.meaning &&
          meaning.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      )));
