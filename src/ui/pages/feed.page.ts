import { Locator, Page, test } from "@playwright/test";
import { BasePage } from "./base.page";

export class FeedPage extends BasePage {
  public readonly personalTab: Locator;
  public readonly contactsTab: Locator;
  public readonly publicTab: Locator;
  public readonly transactionItems: Locator;

  constructor(page: Page) {
    super(page, "/");
    this.personalTab = page.getByTestId("nav-personal-tab");
    this.contactsTab = page.getByTestId("nav-contacts-tab");
    this.publicTab = page.getByTestId("nav-public-tab");
    this.transactionItems = page.locator('[data-test^="transaction-item-"]');
  }

  public async clickPersonalTab(): Promise<void> {
    await test.step("Click Personal tab", async () => {
      const responsePromise = this.page.waitForResponse("**/transactions");
      await this.personalTab.click();
      await responsePromise;
    });
  }

  public async clickContactsTab(): Promise<void> {
    await test.step("Click Contacts tab", async () => {
      const responsePromise = this.page.waitForResponse(
        "**/transactions/contacts",
      );
      await this.contactsTab.click();
      await responsePromise;
    });
  }

  public async clickPublicTab(): Promise<void> {
    await test.step("Click Public tab", async () => {
      const responsePromise = this.page.waitForResponse(
        "**/transactions/public",
      );
      await this.publicTab.click();
      await responsePromise;
    });
  }

  public async openTransactionAtIndex(index: number): Promise<void> {
    await test.step(`Open transaction at index ${index}`, async () => {
      const responsePromise = this.page.waitForResponse("**/transactions/*");
      await this.transactionItems.nth(index).click();
      await responsePromise;
    });
  }
}
