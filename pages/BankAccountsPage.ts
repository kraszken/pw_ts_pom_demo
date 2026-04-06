import { Locator, Page, test } from "@playwright/test";

export class BankAccountsPage {
  public readonly submitButton: Locator;
  public readonly bankNameHelper: Locator;
  public readonly routingNumberHelper: Locator;
  public readonly accountNumberHelper: Locator;

  private readonly createButton: Locator;
  private readonly bankNameInput: Locator;
  private readonly routingNumberInput: Locator;
  private readonly accountNumberInput: Locator;
  private readonly accountList: Locator;

  constructor(public readonly page: Page) {
    this.createButton = page.getByTestId("bankaccount-new");
    this.bankNameInput = page.locator(
      '[data-test="bankaccount-bankName-input"] input',
    );
    this.routingNumberInput = page.locator(
      '[data-test="bankaccount-routingNumber-input"] input',
    );
    this.accountNumberInput = page.locator(
      '[data-test="bankaccount-accountNumber-input"] input',
    );
    this.submitButton = page.getByTestId("bankaccount-submit");
    this.accountList = page.getByTestId("bankaccount-list");
    this.bankNameHelper = page.locator(
      "#bankaccount-bankName-input-helper-text",
    );
    this.routingNumberHelper = page.locator(
      "#bankaccount-routingNumber-input-helper-text",
    );
    this.accountNumberHelper = page.locator(
      "#bankaccount-accountNumber-input-helper-text",
    );
  }

  public getAccountListItemByName(bankName: string): Locator {
    return this.accountList.getByRole("listitem").filter({ hasText: bankName });
  }

  public async navigate(): Promise<void> {
    await test.step("Navigate to Bank Accounts Page", async () => {
      await this.page.goto("/bankaccounts");
    });
  }

  public async initiateNewAccountCreation(): Promise<void> {
    await test.step("Click Create New Bank Account", async () => {
      await this.createButton.click();
    });
  }

  public async fillBankName(value: string): Promise<void> {
    await test.step("Fill bank name", async () => {
      await this.bankNameInput.fill(value);
    });
  }

  public async clearBankName(): Promise<void> {
    await test.step("Clear bank name", async () => {
      await this.bankNameInput.clear();
    });
  }

  public async fillRoutingNumber(value: string): Promise<void> {
    await test.step("Fill routing number", async () => {
      await this.routingNumberInput.fill(value);
    });
  }

  public async fillAccountNumber(value: string): Promise<void> {
    await test.step("Fill account number", async () => {
      await this.accountNumberInput.fill(value);
    });
  }

  public async fillAndSubmitAccountDetails(
    bankName: string,
    routingNumber: string,
    accountNumber: string,
  ): Promise<void> {
    await test.step("Fill and submit new bank account form", async () => {
      await this.bankNameInput.fill(bankName);
      await this.routingNumberInput.fill(routingNumber);
      await this.accountNumberInput.fill(accountNumber);
      await this.submitButton.click();
    });
  }

  public async deleteAccountByName(bankName: string): Promise<void> {
    await test.step(`Delete bank account: ${bankName}`, async () => {
      await this.getAccountListItemByName(bankName)
        .getByTestId("bankaccount-delete")
        .click();
    });
  }

  public async triggerFocusLost(
    inputName: "bankName" | "routingNumber" | "accountNumber",
  ): Promise<void> {
    await test.step(`Trigger focus lost on ${inputName}`, async () => {
      const field =
        inputName === "bankName"
          ? this.bankNameInput
          : inputName === "routingNumber"
            ? this.routingNumberInput
            : this.accountNumberInput;
      await field.click();
      await field.blur();
    });
  }
}
