import { Locator, Page, test } from "@playwright/test";
import { InputComponent } from "../components/input.component";
import { BasePage } from "./base.page";

export class TransactionCreatePage extends BasePage {
  public readonly userList: Locator;
  public readonly submitPaymentButton: Locator;
  public readonly submitRequestButton: Locator;
  public readonly successAlert: Locator;

  public readonly amountInput: InputComponent;
  public readonly descriptionInput: InputComponent;

  private readonly newTransactionButton: Locator;
  private readonly searchInput: Locator;

  constructor(page: Page) {
    super(page, "/");

    this.newTransactionButton = page.getByTestId("nav-top-new-transaction");
    this.searchInput = page.getByTestId("user-list-search-input");
    this.userList = page.getByTestId("users-list");

    this.amountInput = new InputComponent(
      page,
      page.locator('[data-test="transaction-create-amount-input"] input'),
      "#transaction-create-amount-input-helper-text",
    );

    this.descriptionInput = new InputComponent(
      page,
      page.locator('[data-test="transaction-create-description-input"] input'),
      "#transaction-create-description-input-helper-text",
    );

    this.submitPaymentButton = page.locator(
      '[data-test="transaction-create-submit-payment"]',
    );
    this.submitRequestButton = page.locator(
      '[data-test="transaction-create-submit-request"]',
    );
    this.successAlert = page.getByTestId("alert-bar-success");
  }

  public override async navigate(): Promise<void> {
    await test.step("Navigate to Create Transaction Page", async () => {
      await this.page.goto(this.url);
      const usersResponse = this.page.waitForResponse("**/users");
      await this.newTransactionButton.click();
      await usersResponse;
    });
  }

  public getUserListItem(name: string): Locator {
    return this.page
      .locator('[data-test^="user-list-item-"]')
      .filter({ hasText: name });
  }

  // Linia ~60
  public async searchUser(query: string): Promise<void> {
    await test.step(`Search for user: ${query}`, async () => {
      // FIX: Używamy Regex, aby złapać URL z parametrami zapytania (np. ?q=John)
      const searchResponse = this.page.waitForResponse(/users\/search/);
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

  public async fillTransactionDetails(
    amount: string,
    description: string,
  ): Promise<void> {
    await test.step("Fill transaction details", async () => {
      await this.amountInput.fill(amount);
      await this.descriptionInput.fill(description);
    });
  }

  public async submitPayment(): Promise<void> {
    await test.step("Submit payment", async () => {
      const responsePromise = this.page.waitForResponse("**/transactions");
      await this.submitPaymentButton.click();
      await responsePromise;
    });
  }

  public async submitRequest(): Promise<void> {
    await test.step("Submit request", async () => {
      const responsePromise = this.page.waitForResponse("**/transactions");
      await this.submitRequestButton.click();
      await responsePromise;
    });
  }
}
