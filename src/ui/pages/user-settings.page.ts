import { Locator, Page, test } from "@playwright/test";
import { InputComponent } from "../components/input.component";
import { BasePage } from "./base.page";

export class UserSettingsPage extends BasePage {
  public readonly form: Locator;
  public readonly submitButton: Locator;

  public readonly firstNameInput: InputComponent;
  public readonly lastNameInput: InputComponent;
  public readonly emailInput: InputComponent;
  public readonly phoneNumberInput: InputComponent;

  constructor(page: Page) {
    super(page, "/user/settings");

    this.form = page.getByTestId("user-settings-form");
    this.submitButton = page.getByTestId("user-settings-submit");

    this.firstNameInput = new InputComponent(
      page,
      page.getByTestId("user-settings-firstName-input"),
      page.locator("#user-settings-firstName-input-helper-text"),
    );

    this.lastNameInput = new InputComponent(
      page,
      page.getByTestId("user-settings-lastName-input"),
      page.locator("#user-settings-lastName-input-helper-text"),
    );

    this.emailInput = new InputComponent(
      page,
      page.getByTestId("user-settings-email-input"),
      page.locator("#user-settings-email-input-helper-text"),
    );

    this.phoneNumberInput = new InputComponent(
      page,
      page.getByTestId("user-settings-phoneNumber-input"),
      page.locator("#user-settings-phoneNumber-input-helper-text"),
    );
  }

  public async updateProfile(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ): Promise<void> {
    await test.step("Update user profile details", async () => {
      await this.firstNameInput.fill(firstName);
      await this.lastNameInput.fill(lastName);
      await this.emailInput.fill(email);
      await this.phoneNumberInput.fill(phone);
      await this.submitButton.click();
    });
  }
}
