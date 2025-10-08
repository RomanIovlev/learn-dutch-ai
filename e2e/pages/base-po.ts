import { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(readonly page: Page) {}
  async goto(url: string) {
    await this.page.goto(url);
  }
}
