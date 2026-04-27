import { Page, test } from "@playwright/test";

export abstract class BasePage {
  constructor(
    public readonly page: Page,
    protected readonly url: string,
  ) {}

  public async navigate(): Promise<void> {
    await test.step(`Maps to ${this.url}`, async () => {
      await this.page.goto(this.url);
    });
  }
}
