export interface VocabularyQuizProps {
  userId: number;
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
