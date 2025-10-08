export interface Word {
  id: number;
  meanings: Meaning[];
  part_of_speech: PartOfSpeech;
  rank: number;
  word: string;
  verb_form?: Verb;
  noun_form?: Noun;
  adjective_form?: Adjective;
  numeral_form?: Numeral;
  category: string;
}

export interface Meaning {
  meaning: string;
  id: number;
  usage?: string;
  example?: string;
  example_translation?: string;
}

export type PartOfSpeech =
  | "verb"
  | "pronoun"
  | "noun"
  | "adjective"
  | "conjunction"
  | "adverb"
  | "numeral"
  | "article";

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
  separable_prefix: null | string;
  is_separable: boolean;
  is_irregular: boolean;
  is_strong_verb: boolean;
  is_modal: boolean;
}

export interface Noun {
  noun: string;
  indefinite_article: string;
  diminutive: string;
  plural: string;
}

export interface Adjective {
  adjective: string;
  de_form: string;
  comparison: string;
  superlative: string;
}

export interface Numeral {
  numeral: string;
  numeric_value: number;
  ordinal_form: string;
}

export interface ExampleSentenceFromAPI {
  word_id: number;
  word: string;
  example_sentence: string;
}
