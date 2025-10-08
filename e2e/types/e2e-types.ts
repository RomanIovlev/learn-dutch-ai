export interface QuizRound {
  quizWord: string;
  quizCardCorrectWord: RegExp;
  optionClass: RegExp;
  successStat: RegExp;
  incorrectStat: RegExp;
  quizResult: string;
}

export interface QuizWord {
  word: string;
  meaning: string;
}
