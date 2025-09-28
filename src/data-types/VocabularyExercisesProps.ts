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
  partOfSpeech: PartOfSpeech;
}

export interface NounExercise extends BaseExercise {
  plural: string;
  diminutive: string;
  indefiniteArticle: string;
}

export interface VerbExercise extends BaseExercise {
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
  adjective: string;
  deForm: string;
  comparison: string;
  superlative: string;
}

export interface NumeralExercise extends BaseExercise {
  numeral: string;
  numericValue: number;
  ordinalForm: string;
}

export type FillExercise = BaseExercise &
  Partial<NounExercise> &
  Partial<VerbExercise> &
  Partial<AdjectiveExercise> &
  Partial<NumeralExercise>;
