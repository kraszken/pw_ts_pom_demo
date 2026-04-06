import { Locator, Page, test } from "@playwright/test";

export class OnboardingPage {
  public readonly dialog: Locator;
  public readonly dialogTitle: Locator;

  private readonly nextButton: Locator;
  private readonly bankNameInput: Locator;
  private readonly routingNumberInput: Locator;
  private readonly accountNumberInput: Locator;
  private readonly submitButton: Locator;

  constructor(public readonly page: Page) {
    this.dialog = page.getByTestId("user-onboarding-dialog");
    this.dialogTitle = page.getByTestId("user-onboarding-dialog-title");
    this.nextButton = page.getByTestId("user-onboarding-next");
    this.bankNameInput = page.locator('[data-test*="bankName-input"] input');
    this.routingNumberInput = page.locator(
      '[data-test*="routingNumber-input"] input',
    );
    this.accountNumberInput = page.locator(
      '[data-test*="accountNumber-input"] input',
    );
    this.submitButton = page.locator('[data-test*="submit"]');
  }

  public async clickNext(): Promise<void> {
    await test.step("Click Next", async () => {
      await this.nextButton.click();
    });
  }

  public async submitBankDetails(
    bankName: string,
    routingNumber: string,
    accountNumber: string,
  ): Promise<void> {
    await test.step("Fill and submit bank details", async () => {
      await this.bankNameInput.fill(bankName);
      await this.routingNumberInput.fill(routingNumber);
      await this.accountNumberInput.fill(accountNumber);
      await this.submitButton.click();
    });
  }
}
