import { Locator, Page, test } from "@playwright/test";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
  public readonly sidenavUsername: Locator;
  public readonly notificationsBadge: Locator;

  private readonly notificationsLink: Locator;

  constructor(page: Page) {
    super(page, "/");
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
