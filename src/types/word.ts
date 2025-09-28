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

export interface Verb {}

export interface Noun {}

export interface Adjective {}

export interface Numeral {}
