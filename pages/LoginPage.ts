import { Locator, Page, expect } from "@playwright/test";
import { env } from "process";

export class LoginPage {
  readonly page: Page;

  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  public readonly signInButton: Locator;
  private readonly rememberMeButton: Locator;
  private readonly signUpLink: Locator;
  public readonly usernameHelper: Locator;
  public readonly passwordHelper: Locator;
  public readonly signinError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole("textbox", { name: "Username" });
    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.signInButton = page.getByTestId("signin-submit");
    this.rememberMeButton = page.getByTestId("signin-remember-me");
    this.signUpLink = page.getByTestId("signup");
    this.usernameHelper = page.locator("#username-helper-text");
    this.passwordHelper = page.locator("#password-helper-text");
    this.signinError = page.getByTestId("signin-error");
  }

  async navigate(): Promise<void> {
    await this.page.goto(env.LOGIN_URL!);
    await this.isLoginPageReady();
  }

  private async isLoginPageReady(): Promise<void> {
    await expect.soft(this.page).toHaveURL(`${env.LOGIN_URL}signin`);
    await this.usernameField.waitFor();
    await this.passwordField.waitFor();
    await this.signInButton.waitFor();
    await this.rememberMeButton.waitFor();
    await this.signUpLink.waitFor();
    await expect.soft(this.page).toHaveTitle("Cypress Real World App");
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameField.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async clickSignInButton(): Promise<void> {
    await this.signInButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignInButton();
  }

  async inputFocusLost(inputName: "username" | "password"): Promise<void> {
    const inputField =
      inputName === "username" ? this.usernameField : this.passwordField;

    await inputField.click();
    await inputField.blur();
  }
}
