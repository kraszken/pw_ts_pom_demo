import { Locator, Page, test } from "@playwright/test";

export class FeedPage {
  public readonly personalTab: Locator;
  public readonly contactsTab: Locator;
  public readonly publicTab: Locator;
  public readonly transactionItems: Locator;

  constructor(public readonly page: Page) {
    this.personalTab = page.getByTestId("nav-personal-tab");
    this.contactsTab = page.getByTestId("nav-contacts-tab");
    this.publicTab = page.getByTestId("nav-public-tab");
    this.transactionItems = page.locator('[data-test^="transaction-item-"]');
  }

  public async navigate(): Promise<void> {
    await test.step("Navigate to Feed Page", async () => {
      await this.page.goto("/");
    });
  }

  public async clickPersonalTab(): Promise<void> {
    await test.step("Click Personal tab", async () => {
      const responsePromise = this.page.waitForResponse(
        (r) =>
          new URL(r.url()).pathname === "/transactions" &&
          r.request().method() === "GET",
      );
      await this.personalTab.click();
      await responsePromise;
    });
  }

  public async clickContactsTab(): Promise<void> {
    await test.step("Click Contacts tab", async () => {
      const responsePromise = this.page.waitForResponse(
        (r) =>
          new URL(r.url()).pathname === "/transactions/contacts" &&
          r.request().method() === "GET",
      );
      await this.contactsTab.click();
      await responsePromise;
    });
  }

  public async clickPublicTab(): Promise<void> {
    await test.step("Click Public tab", async () => {
      const responsePromise = this.page.waitForResponse(
        (r) =>
          new URL(r.url()).pathname === "/transactions/public" &&
          r.request().method() === "GET",
      );
      await this.publicTab.click();
      await responsePromise;
    });
  }

  public async openTransactionAtIndex(index: number): Promise<void> {
    await test.step(`Open transaction at index ${index}`, async () => {
      const responsePromise = this.page.waitForResponse(
        (r) =>
          r.url().includes("/transactions/") && r.request().method() === "GET",
      );
      await this.transactionItems.nth(index).click();
      await responsePromise;
    });
  }
}
