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
  verb?: Verb;
  noun?: Noun;
  adjective?: Adjective;
  numeral?: Numeral;
}

export interface Verb {
  infinitive: string;
  present: {
    ik: string;
    jij: string;
    u: string;
    hij: string;
    wij: string;
  };
  past: {
    sg: string;
    pl: string;
  };
  perfect: {
    aux: string;
    participle: string;
  };
  separablePrefix: null | string;
  isSeparable: boolean;
  isIrregular: boolean;
  isStrongVerb: boolean;
  isMmodal: boolean;
}

export interface Noun {
  noun: string;
  indefiniteArticle: string;
  diminutive: string;
  plural: string;
}

export interface Adjective {
  adjective: string;
  deForm: string;
  comparison: string;
  superlative: string;
}

export interface Numeral {
  numeral: string;
  numericValue: number;
  ordinalForm: string;
}

export interface ExampleSentence {
  wordId: number;
  word: string;
  exampleSentence: string;
}
