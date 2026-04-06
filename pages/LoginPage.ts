import { Locator, Page, test } from "@playwright/test";

export class LoginPage {
  public readonly signInButton: Locator;
  public readonly usernameHelper: Locator;
  public readonly passwordHelper: Locator;
  public readonly signinError: Locator;
  public readonly passwordField: Locator;

  private readonly usernameField: Locator;
  private readonly signUpLink: Locator;

  constructor(public readonly page: Page) {
    this.usernameField = page.getByRole("textbox", { name: "Username" });
    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.signInButton = page.getByTestId("signin-submit");
    this.signUpLink = page.getByTestId("signup");
    this.usernameHelper = page.locator("#username-helper-text");
    this.passwordHelper = page.locator("#password-helper-text");
    this.signinError = page.getByTestId("signin-error");
  }

  public async navigate(): Promise<void> {
    await test.step("Navigate to Login Page", async () => {
      await this.page.goto("/signin");
    });
  }

  public async fillUsername(username: string): Promise<void> {
    await test.step("Fill username", async () => {
      await this.usernameField.fill(username);
    });
  }

  public async fillPassword(password: string): Promise<void> {
    await test.step("Fill password", async () => {
      await this.passwordField.fill(password);
    });
  }

  public async clickSignInButton(): Promise<void> {
    await test.step("Click sign in button", async () => {
      await this.signInButton.click();
    });
  }

  public async login(username: string, password: string): Promise<void> {
    await test.step(`Perform full login for user: ${username}`, async () => {
      await this.usernameField.fill(username);
      await this.passwordField.fill(password);
      await this.signInButton.click();
    });
  }

  public async triggerFocusLost(
    inputName: "username" | "password",
  ): Promise<void> {
    await test.step(`Trigger focus lost on ${inputName} field`, async () => {
      const inputField =
        inputName === "username" ? this.usernameField : this.passwordField;
      await inputField.click();
      await inputField.blur();
    });
  }

  public async enterPasswordAndSubmit(password: string): Promise<void> {
    await test.step("Enter password and press Enter key", async () => {
      await this.passwordField.fill(password);
      await this.passwordField.press("Enter");
    });
  }

  public async goToSignup(): Promise<void> {
    await test.step("Click sign up link", async () => {
      await this.signUpLink.focus();
      await this.signUpLink.click();
    });
  }
}
