declare module './vocabulary.json' {
  interface VocabularyItem {
    dutch: string;
    english: string;
    examples: Array<{ nl: string; en: string }>;
    context: string;
    partOfSpeech: string;
  }
  
  const value: VocabularyItem[];
  export default value;
} 