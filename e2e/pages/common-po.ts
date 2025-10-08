import { BasePage } from "./base-po";

export class CommonPage extends BasePage {
  quizLink = this.page.getByRole("link", { name: "Quiz Mode" });
  moreExerciseLink = this.page.getByRole("link", { name: "More Exercises" });
  vocabularyLink = this.page.getByRole("link", { name: "Vocabulary" });
}
