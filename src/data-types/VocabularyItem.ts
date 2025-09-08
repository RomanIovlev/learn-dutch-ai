export interface VocabularyMeaning {
  english: string;
  examples: Array<{ nl: string; en: string }>;
  context: string;
  partOfSpeech: string;
  category: string;
  rating: number;
}

export interface VocabularyItem {
  dutch: string;
  meanings: VocabularyMeaning[];
} 