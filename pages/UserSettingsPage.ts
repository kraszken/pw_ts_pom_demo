import { Locator, Page, test } from "@playwright/test";

export class UserSettingsPage {
  public readonly form: Locator;
  public readonly submitButton: Locator;
  public readonly firstNameHelper: Locator;
  public readonly lastNameHelper: Locator;
  public readonly emailHelper: Locator;
  public readonly phoneNumberHelper: Locator;

  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneNumberInput: Locator;

  constructor(public readonly page: Page) {
    this.form = page.getByTestId("user-settings-form");
    this.firstNameInput = page.getByTestId("user-settings-firstName-input");
    this.lastNameInput = page.getByTestId("user-settings-lastName-input");
    this.emailInput = page.getByTestId("user-settings-email-input");
    this.phoneNumberInput = page.getByTestId("user-settings-phoneNumber-input");
    this.submitButton = page.getByTestId("user-settings-submit");
    this.firstNameHelper = page.locator(
      "#user-settings-firstName-input-helper-text",
    );
    this.lastNameHelper = page.locator(
      "#user-settings-lastName-input-helper-text",
    );
    this.emailHelper = page.locator("#user-settings-email-input-helper-text");
    this.phoneNumberHelper = page.locator(
      "#user-settings-phoneNumber-input-helper-text",
    );
  }

  public async navigate(): Promise<void> {
    await test.step("Navigate to User Settings Page", async () => {
      await this.page.goto("/user/settings");
    });
  }

  public async triggerFocusLost(
    inputName: "firstName" | "lastName" | "email" | "phoneNumber",
  ): Promise<void> {
    await test.step(`Trigger focus lost on ${inputName}`, async () => {
      const field =
        inputName === "firstName"
          ? this.firstNameInput
          : inputName === "lastName"
            ? this.lastNameInput
            : inputName === "email"
              ? this.emailInput
              : this.phoneNumberInput;
      await field.click();
      await field.blur();
    });
  }

  public async fillFirstName(value: string): Promise<void> {
    await test.step("Fill first name", async () => {
      await this.firstNameInput.fill(value);
    });
  }

  public async clearFirstName(): Promise<void> {
    await test.step("Clear first name", async () => {
      await this.firstNameInput.clear();
    });
  }

  public async fillLastName(value: string): Promise<void> {
    await test.step("Fill last name", async () => {
      await this.lastNameInput.fill(value);
    });
  }

  public async clearLastName(): Promise<void> {
    await test.step("Clear last name", async () => {
      await this.lastNameInput.clear();
    });
  }

  public async fillEmail(value: string): Promise<void> {
    await test.step("Fill email", async () => {
      await this.emailInput.fill(value);
    });
  }

  public async fillPhoneNumber(value: string): Promise<void> {
    await test.step("Fill phone number", async () => {
      await this.phoneNumberInput.fill(value);
    });
  }

  public async updateProfile(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ): Promise<void> {
    await test.step("Update user profile", async () => {
      await this.firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
      await this.emailInput.fill(email);
      await this.phoneNumberInput.fill(phone);
      await this.submitButton.click();
    });
  }
}
