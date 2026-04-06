import { Locator, Page } from "@playwright/test";

export class HomePage {
  public readonly sidenavUsername: Locator;
  public readonly notificationsBadge: Locator;
  public readonly notificationsLink: Locator;

  constructor(public readonly page: Page) {
    this.sidenavUsername = page.getByTestId("sidenav-username");
    this.notificationsBadge = page.getByTestId("nav-top-notifications-count");
    this.notificationsLink = page.getByTestId("sidenav-notifications");
  }
}
