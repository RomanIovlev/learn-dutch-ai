import { QuizWord } from "../types/e2e-types";
import { CommonPage } from "./common-po";
import { expect } from "@playwright/test";

export class QuizPage extends CommonPage {
  quizStats = this.page.getByTestId("quiz-stats");
  quizStatSuccess = this.page.getByTestId("quiz-stats-success");
  quizStatIncorrect = this.page.getByTestId("quiz-stats-incorrect");
  quizCard = this.page.getByTestId("quiz-card");
  instructions = this.page.getByTestId("instructions");
  quizOptions = this.page.getByTestId("quiz-options");
  quizOption = this.quizOptions.getByRole("button");
  quizOptionText = (name: string) =>
    this.quizOptions.getByRole("button", { name });
  quizResult = this.page.getByTestId("quiz-result");
  actions = this.page.getByTestId("actions");
  actionButton = (name: string) =>
    this.actions.getByRole("button", {
      name,
    });

  async finishFullQuiz({
    quizList,
    isSuccessStat,
  }: {
    quizList: QuizWord[];
    isSuccessStat: boolean;
  }) {
    for (const [index, quiz] of quizList.entries()) {
      await expect(this.quizCard).toHaveText(quiz.word);
      await this.quizOptionText(quiz.meaning).click();
      const statLocator = isSuccessStat
        ? this.quizStatSuccess
        : this.quizStatIncorrect;
      await expect(statLocator).toHaveText(new RegExp(`${index + 1}`));
      await this.quizCard.click();
    }
  }
}
