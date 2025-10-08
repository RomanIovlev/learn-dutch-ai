import { test as base } from "@playwright/test";
import { QuizPage } from "./pages/quiz-po";
import { ExercisesPage } from "./pages/exercises-po";
import { VocabularyPage } from "./pages/vocabulary-po";

export const test = base.extend<{
  quizPage: QuizPage;
  exercisePage: ExercisesPage;
  vocabularyPage: VocabularyPage;
}>({
  quizPage: async ({ page }, use) => {
    const quizPage = new QuizPage(page);
    await quizPage.goto("/");
    await use(quizPage);
  },
  exercisePage: async ({ page }, use) => {
    const exercisePage = new ExercisesPage(page);
    await exercisePage.goto("/exercises");
    await use(exercisePage);
  },
  vocabularyPage: async ({ page }, use) => {
    const vocabularyPage = new VocabularyPage(page);
    await vocabularyPage.goto("/vocabulary");
    await use(vocabularyPage);
  },
});
