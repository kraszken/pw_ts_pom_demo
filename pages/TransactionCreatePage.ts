import { Locator, Page, test } from "@playwright/test";

export class TransactionCreatePage {
  public readonly userList: Locator;
  public readonly submitPaymentButton: Locator;
  public readonly submitRequestButton: Locator;
  public readonly successAlert: Locator;
  public readonly amountHelper: Locator;
  public readonly descriptionHelper: Locator;

  private readonly newTransactionButton: Locator;
  private readonly searchInput: Locator;
  private readonly amountInput: Locator;
  private readonly descriptionInput: Locator;

  constructor(public readonly page: Page) {
    this.newTransactionButton = page.getByTestId("nav-top-new-transaction");
    this.searchInput = page.getByTestId("user-list-search-input");
    this.userList = page.getByTestId("users-list");
    this.amountInput = page.locator(
      '[data-test="transaction-create-amount-input"] input',
    );
    this.descriptionInput = page.locator(
      '[data-test="transaction-create-description-input"] input',
    );
    this.submitPaymentButton = page.locator(
      '[data-test="transaction-create-submit-payment"]',
    );
    this.submitRequestButton = page.locator(
      '[data-test="transaction-create-submit-request"]',
    );
    this.successAlert = page.getByTestId("alert-bar-success");
    this.amountHelper = page.locator(
      "#transaction-create-amount-input-helper-text",
    );
    this.descriptionHelper = page.locator(
      "#transaction-create-description-input-helper-text",
    );
  }

  public getUserListItem(name: string): Locator {
    return this.page
      .locator('[data-test^="user-list-item-"]')
      .filter({ hasText: name });
  }

  public async navigate(): Promise<void> {
    await test.step("Navigate to Create Transaction Page", async () => {
      await this.page.goto("/");
      const usersResponse = this.page.waitForResponse(
        (r) =>
          new URL(r.url()).pathname === "/users" &&
          r.request().method() === "GET",
      );
      await this.newTransactionButton.click();
      await usersResponse;
    });
  }

  public async searchUser(query: string): Promise<void> {
    await test.step(`Search for user: ${query}`, async () => {
      const searchResponse = this.page.waitForResponse(
        (r) => new URL(r.url()).pathname === "/users/search",
      );
      await this.searchInput.fill(query);
      await searchResponse;
    });
  }

  public async clearSearch(): Promise<void> {
    await test.step("Clear user search", async () => {
      await this.searchInput.clear();
    });
  }

  public async selectUser(name: string): Promise<void> {
    await test.step(`Select user: ${name}`, async () => {
      await this.getUserListItem(name).click();
    });
  }

  public async fillAmount(amount: string): Promise<void> {
    await test.step("Fill amount", async () => {
      await this.amountInput.fill(amount);
    });
  }

  public async clearAmount(): Promise<void> {
    await test.step("Clear amount", async () => {
      await this.amountInput.clear();
    });
  }

  public async fillDescription(description: string): Promise<void> {
    await test.step("Fill description", async () => {
      await this.descriptionInput.fill(description);
    });
  }

  public async clearDescription(): Promise<void> {
    await test.step("Clear description", async () => {
      await this.descriptionInput.clear();
    });
  }

  public async fillTransactionDetails(
    amount: string,
    description: string,
  ): Promise<void> {
    await test.step("Fill transaction details", async () => {
      await this.amountInput.fill(amount);
      await this.descriptionInput.fill(description);
    });
  }

  public async triggerFocusLost(
    inputName: "amount" | "description",
  ): Promise<void> {
    await test.step(`Trigger focus lost on ${inputName}`, async () => {
      const field =
        inputName === "amount" ? this.amountInput : this.descriptionInput;
      await field.click();
      await field.blur();
    });
  }

  public async submitPayment(): Promise<void> {
    await test.step("Submit payment", async () => {
      const responsePromise = this.page.waitForResponse(
        (r) =>
          new URL(r.url()).pathname === "/transactions" &&
          r.request().method() === "POST",
      );
      await this.submitPaymentButton.click();
      await responsePromise;
    });
  }

  public async submitRequest(): Promise<void> {
    await test.step("Submit request", async () => {
      const responsePromise = this.page.waitForResponse(
        (r) =>
          new URL(r.url()).pathname === "/transactions" &&
          r.request().method() === "POST",
      );
      await this.submitRequestButton.click();
      await responsePromise;
    });
  }
}
