import { Locator, Page, test } from "@playwright/test";
import { InputComponent } from "../components/input.component";
import { BasePage } from "./base.page";

export class BankAccountsPage extends BasePage {
  public readonly submitButton: Locator;
  public readonly bankNameInput: InputComponent;
  public readonly routingNumberInput: InputComponent;
  public readonly accountNumberInput: InputComponent;

  private readonly createButton: Locator;
  private readonly accountList: Locator;

  constructor(page: Page) {
    super(page, "/bankaccounts");

    this.createButton = page.getByTestId("bankaccount-new");
    this.submitButton = page.getByTestId("bankaccount-submit");
    this.accountList = page.getByTestId("bankaccount-list");

    this.bankNameInput = new InputComponent(
      page,
      page.locator('[data-test="bankaccount-bankName-input"] input'),
      "#bankaccount-bankName-input-helper-text",
    );

    this.routingNumberInput = new InputComponent(
      page,
      page.locator('[data-test="bankaccount-routingNumber-input"] input'),
      "#bankaccount-routingNumber-input-helper-text",
    );

    this.accountNumberInput = new InputComponent(
      page,
      page.locator('[data-test="bankaccount-accountNumber-input"] input'),
      "#bankaccount-accountNumber-input-helper-text",
    );
  }

  public getAccountListItemByName(bankName: string): Locator {
    return this.accountList.getByRole("listitem").filter({ hasText: bankName });
  }

  public async initiateNewAccountCreation(): Promise<void> {
    await test.step("Click Create New Bank Account", async () => {
      await this.createButton.click();
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
}
