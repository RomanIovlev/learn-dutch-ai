import { Word } from "./word";

export interface VocabularyMeaning {
  meaning: string;
  example: string;
  context: string;
  exampleTranslation: string;
}

export interface VocabularyItem {
  word: string;
  meanings: VocabularyMeaning[];
  id: number;
  rating: number;
  partOfSpeech: Word["part_of_speech"];
  category: string;
}
