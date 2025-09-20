import { VocabularyItem } from "../types/vocabulary";
import { FrozenWord } from "./FrozenWord";

export interface VocabularyQuizProps {
  vocabulary: VocabularyItem[];
  // availableWords: VocabularyItem[];
  onUpdateRating: (wordsRanks: WordRank[]) => // dutchWord: string,
  // meaningIndex: number,
  // change: number
  Promise<void>;
  //   onFreezeWord: (dutchWord: string) => Promise<void>;
  //   onDecreaseFreezeCounters: () => Promise<void>;
  //   onResetRatings: () => Promise<void>;
  //   frozenWords: FrozenWord[];
}

export interface Stat {
  correct: number;
  incorrect: number;
  knownWords: number;
}

export interface WordRank {
  wordId: number;
  rank: number;
}
