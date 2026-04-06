import { Locator, Page, test } from "@playwright/test";

export class HomePage {
  public readonly sidenavUsername: Locator;
  public readonly notificationsBadge: Locator;

  private readonly notificationsLink: Locator;

  constructor(public readonly page: Page) {
    this.sidenavUsername = page.getByTestId("sidenav-username");
    this.notificationsBadge = page.getByTestId("nav-top-notifications-count");
    this.notificationsLink = page.getByTestId("sidenav-notifications");
  }

  public async clickNotificationsLink(): Promise<void> {
    await test.step("Click notifications link", async () => {
      await this.notificationsLink.click();
    });
  }
}
