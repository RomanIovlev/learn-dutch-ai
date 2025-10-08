import { expect } from "@playwright/test";
import { test } from "../fixtures";

test.describe("Smoke test", () => {
  test.describe("Quiz page", () => {
    test("has quiz page with content", async ({ quizPage }) => {
      await expect(quizPage.quizLink).toBeVisible();
      await expect(quizPage.quizStats).toBeVisible();
      await expect(quizPage.quizCard).toBeVisible();
      await expect(quizPage.instructions).toBeVisible();
      await expect(quizPage.quizOptions).toBeVisible();
      await expect(quizPage.quizOption).toHaveCount(6);
      await expect(quizPage.quizResult).toBeHidden();
      await expect(quizPage.actions).toBeVisible();
    });
  });

  test.describe("Exercises page", () => {
    test("has exercises page with content", async ({ exercisePage }) => {
      await expect(exercisePage.exerciseSelector).toBeVisible();
      await expect(exercisePage.fillExerciseForms).toBeVisible();
      await expect(exercisePage.fillGapExercises).toBeHidden();
      await expect(exercisePage.exerciseBanner).toBeHidden();
      await expect(exercisePage.actions).toBeVisible();
    });
  });

  test.describe("Vocabulary page", () => {
    test("has vocabulary page with content", async ({ vocabularyPage }) => {
      await expect(vocabularyPage.vocabularyStatsDashboard).toBeVisible();
      await expect(vocabularyPage.vocabularyStats).toBeVisible();
      await expect(vocabularyPage.sortAndSearch).toBeVisible();
      await expect(vocabularyPage.vocabularyItemCard.first()).toBeVisible();
      await expect(vocabularyPage.vocabularyPartOfSpeech).toBeVisible();
      await expect(vocabularyPage.vocabularyActionBard).toBeHidden();
      await expect(vocabularyPage.vocabularyEmptyState).toBeHidden();
    });
  });
});
