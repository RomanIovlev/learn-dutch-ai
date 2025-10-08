import { expect } from "@playwright/test";
import { test } from "../fixtures";
import {
  correctListWords,
  mockQuizWords,
  incorrectListWords,
  wordUpRankItemsPatch,
} from "../mock/quizWords";

test.describe("Vocabulary quiz", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/words/app-user/**", async (route) => {
      const request = route.request();
      const method = request.method();

      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockQuizWords),
        });
      }
      if (method === "PATCH") {
        const requestBody = await request.postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            items: requestBody.items || [],
          }),
        });
      }
    });
    await page.goto("/quiz");
  });

  test("should display quiz with mocked vocabulary data", async ({
    quizPage,
  }) => {
    await expect(quizPage.quizCard).toHaveText(/^hond/);
    await expect(quizPage.quizOptions).toBeVisible();
    await expect(quizPage.quizOption).toHaveCount(6);

    const answers = mockQuizWords.map((mock) => mock.meanings[0].meaning);
    answers.forEach(async (answer) => {
      await expect(quizPage.quizOptionText(answer)).toBeVisible();
    });
    await expect(quizPage.instructions).toHaveText(
      'What does "hond" mean in English?'
    );
    await expect(quizPage.actionButton("Reset All Progress")).toBeVisible();
  });

  test("should be able to click correct quiz variant", async ({ quizPage }) => {
    await expect(quizPage.quizOptions).toBeVisible();

    await quizPage.quizOptionText("dog").click();
    await expect(quizPage.quizOptionText("dog")).toHaveClass(/correct/);
    await expect(quizPage.quizResult).toHaveText(
      "🎉 Correct!👆Click anywhere in this area to continue to next word"
    );
    await expect(quizPage.quizCard).toHaveText(/dog/);

    await quizPage.quizCard.click();
    await expect(quizPage.quizResult).toBeHidden();
    await expect(quizPage.quizStatSuccess).toHaveText(/1/);
    await expect(quizPage.quizStatIncorrect).toHaveText(/0/);

    await expect(quizPage.quizCard).toHaveText(/^kat/);
    (await quizPage.quizOption.all()).forEach((option) => {
      expect(option).not.toHaveClass("correct");
      expect(option).not.toHaveClass("incorrect");
    });
    await expect(quizPage.quizResult).toBeHidden();
  });

  test("should be able to click wrong quiz variant", async ({ quizPage }) => {
    await expect(quizPage.quizOptions).toBeVisible();

    await quizPage.quizOptionText("cat").click();
    await expect(quizPage.quizOptionText("dog")).toHaveClass(/correct/);
    await expect(quizPage.quizOptionText("cat")).toHaveClass(/incorrect/);
    await expect(quizPage.quizResult).toHaveText(
      /❌ Incorrect👆Click anywhere in this area to continue to next word/
    );
    await expect(quizPage.quizCard).toHaveText(/dog/);

    await quizPage.quizCard.click();
    await expect(quizPage.quizStatSuccess).toHaveText(/0/);
    await expect(quizPage.quizStatIncorrect).toHaveText(/1/);

    await expect(quizPage.quizCard).toHaveText(/^kat/);
    (await quizPage.quizOption.all()).forEach((option) => {
      expect(option).not.toHaveClass("correct");
      expect(option).not.toHaveClass("incorrect");
    });
    await expect(quizPage.quizResult).toBeHidden();
  });

  test("should be able to apply quiz result", async ({ quizPage }) => {
    quizPage.finishFullQuiz({
      quizList: correctListWords,
      isSuccessStat: true,
    });

    await expect(quizPage.quizCard).toBeHidden();
    await expect(quizPage.quizOptions).toBeHidden();

    await quizPage.actionButton("Apply progress").click();
    await expect(quizPage.quizCard).toBeVisible();
  });

  test("should be able to reset quiz result", async ({ quizPage }) => {
    quizPage.finishFullQuiz({
      quizList: incorrectListWords,
      isSuccessStat: false,
    });

    await expect(quizPage.quizCard).toBeHidden();
    await expect(quizPage.quizOptions).toBeHidden();

    await quizPage.actionButton("Reset All Progress").click();
    await expect(quizPage.quizCard).toBeVisible();
  });
});
