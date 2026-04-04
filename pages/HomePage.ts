import { Locator, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly sidenavUsername: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidenavUsername = page.getByTestId("sidenav-username");
  }
}
