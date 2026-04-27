import { Locator, Page } from "@playwright/test";

export abstract class BaseComponent {
  constructor(
    protected readonly page: Page,
    protected readonly rootLocator: Locator,
  ) {}

  /**
   * Zwraca główny lokator komponentu, np. do sprawdzenia widoczności w asercjach.
   */
  public get locator(): Locator {
    return this.rootLocator;
  }
}
