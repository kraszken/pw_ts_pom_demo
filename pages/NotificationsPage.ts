import { Locator, Page, test } from "@playwright/test";

export class NotificationsPage {
  public readonly notificationItems: Locator;
  public readonly emptyListHeader: Locator;

  private readonly markAsReadButtons: Locator;

  constructor(public readonly page: Page) {
    this.notificationItems = page.locator(
      '[data-test^="notification-list-item-"]',
    );
    this.markAsReadButtons = page.locator(
      '[data-test^="notification-mark-read-"]',
    );
    this.emptyListHeader = page.getByTestId("empty-list-header");
  }

  public async navigate(): Promise<void> {
    await test.step("Navigate to Notifications Page", async () => {
      await this.page.goto("/notifications");
    });
  }

  public async markAsReadAtIndex(index: number): Promise<void> {
    await test.step(`Mark notification as read at index ${index}`, async () => {
      const responsePromise = this.page.waitForResponse(
        (r) =>
          r.url().includes("/notifications/") &&
          r.request().method() === "PATCH",
      );
      await this.markAsReadButtons.nth(index).click();
      await responsePromise;
    });
  }
}
