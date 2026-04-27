import { Locator, Page, test } from "@playwright/test";
import { InputComponent } from "../components/input.component";
import { BasePage } from "./base.page";

export class OnboardingPage extends BasePage {
  public readonly dialog: Locator;
  public readonly dialogTitle: Locator;

  private readonly nextButton: Locator;
  private readonly submitButton: Locator;

  public readonly bankNameInput: InputComponent;
  public readonly routingNumberInput: InputComponent;
  public readonly accountNumberInput: InputComponent;

  constructor(page: Page) {
    super(page, "/"); // Onboarding pojawia się po zalogowaniu na ścieżce głównej

    this.dialog = page.getByTestId("user-onboarding-dialog");
    this.dialogTitle = page.getByTestId("user-onboarding-dialog-title");
    this.nextButton = page.getByTestId("user-onboarding-next");
    this.submitButton = page.locator('[data-test*="submit"]');

    this.bankNameInput = new InputComponent(
      page,
      page.locator('[data-test*="bankName-input"] input'),
      '[id*="bankName-input-helper-text"]',
    );

    this.routingNumberInput = new InputComponent(
      page,
      page.locator('[data-test*="routingNumber-input"] input'),
      '[id*="routingNumber-input-helper-text"]',
    );

    this.accountNumberInput = new InputComponent(
      page,
      page.locator('[data-test*="accountNumber-input"] input'),
      '[id*="accountNumber-input-helper-text"]',
    );
  }

  public async clickNext(): Promise<void> {
    await test.step("Click Next in onboarding dialog", async () => {
      await this.nextButton.click();
    });
  }

  public async submitBankDetails(
    bankName: string,
    routingNumber: string,
    accountNumber: string,
  ): Promise<void> {
    await test.step("Fill and submit bank details for onboarding", async () => {
      await this.bankNameInput.fill(bankName);
      await this.routingNumberInput.fill(routingNumber);
      await this.accountNumberInput.fill(accountNumber);
      await this.submitButton.click();
    });
  }
}
