import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./base.component";

export class InputComponent extends BaseComponent {
  public readonly helperText: Locator;

  constructor(
    page: Page,
    rootLocator: Locator,
    helperSelector: string,
    private readonly isMasked: boolean = false,
  ) {
    super(page, rootLocator);
    this.helperText = page.locator(helperSelector);
  }

  public async fill(value: string): Promise<void> {
    await this.rootLocator.fill(value);
  }

  public async clear(): Promise<void> {
    await this.rootLocator.clear();
  }

  public async blur(): Promise<void> {
    await this.rootLocator.click();
    await this.rootLocator.blur();
  }

  public async pressEnter(): Promise<void> {
    await this.rootLocator.press("Enter");
  }
}
