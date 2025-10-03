import { PartOfSpeech } from "../types/word";

export interface VocabularyExercisesProps {
  userId: number;
}

// Verb Conjugation Types
export interface PresentTense {
  ik: string;
  jij: string;
  u: string;
  hij: string;
  wij: string;
}

export interface PastTense {
  sg: string;
  pl: string;
}

export interface PerfectTense {
  aux: string;
  participle: string;
}

// Exercise Types
export interface BaseExercise {
  id: number;
  word: string;
}

export interface NounExercise extends BaseExercise {
  partOfSpeech: PartOfSpeech;
  plural: string;
  diminutive: string;
  indefiniteArticle: string;
}

export interface VerbExercise extends BaseExercise {
  partOfSpeech: PartOfSpeech;
  infinitive: string;
  present: PresentTense;
  past: PastTense;
  perfect: PerfectTense;
  separablePrefix: string;
  isSeparable: boolean;
  isIrregular: boolean;
  isStrongVerb: boolean;
  isMmodal: boolean;
}

export interface AdjectiveExercise extends BaseExercise {
  partOfSpeech: PartOfSpeech;
  adjective: string;
  deForm: string;
  comparison: string;
  superlative: string;
}

export interface NumeralExercise extends BaseExercise {
  partOfSpeech: PartOfSpeech;
  numeral: string;
  numericValue: number;
  ordinalForm: string;
}

export type FillExercise = BaseExercise &
  Partial<NounExercise> &
  Partial<VerbExercise> &
  Partial<AdjectiveExercise> &
  Partial<NumeralExercise>;

// Gap Fill Exercise Types
export interface GapExercise {
  wordId: number;
  word: string;
  exampleSentence: string;
  userAnswer: string;
}

export interface FillGapsProps {
  examples: Array<{
    wordId: number;
    word: string;
    exampleSentence: string;
  }>;
  onVerifyResult: (exercises: GapExercise[]) => void;
  onFetchExamples: () => Promise<void>;
  isLoading: boolean;
}
