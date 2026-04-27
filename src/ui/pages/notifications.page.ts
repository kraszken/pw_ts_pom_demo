import { Locator, Page, test } from "@playwright/test";
import { BasePage } from "./base.page";

export class NotificationsPage extends BasePage {
  public readonly notificationItems: Locator;
  public readonly emptyListHeader: Locator;

  private readonly markAsReadButtons: Locator;

  constructor(page: Page) {
    super(page, "/notifications");

    this.notificationItems = page.locator(
      '[data-test^="notification-list-item-"]',
    );
    this.markAsReadButtons = page.locator(
      '[data-test^="notification-mark-read-"]',
    );
    this.emptyListHeader = page.getByTestId("empty-list-header");
  }

  public async markAsReadAtIndex(index: number): Promise<void> {
    await test.step(`Mark notification as read at index ${index}`, async () => {
      const responsePromise = this.page.waitForResponse("**/notifications/*");
      await this.markAsReadButtons.nth(index).click();
      await responsePromise;
    });
  }
}
