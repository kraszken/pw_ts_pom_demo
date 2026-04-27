import { Locator, Page, test } from "@playwright/test";
import { InputComponent } from "../components/input.component";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {
  public readonly usernameInput: InputComponent;
  public readonly passwordInput: InputComponent;
  public readonly signInButton: Locator;
  public readonly signinError: Locator;

  private readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page, "/signin");

    this.usernameInput = new InputComponent(
      page,
      page.getByRole("textbox", { name: "Username" }),
      "#username-helper-text",
    );

    this.passwordInput = new InputComponent(
      page,
      page.getByRole("textbox", { name: "Password" }),
      "#password-helper-text",
      true,
    );

    this.signInButton = page.getByTestId("signin-submit");
    this.signUpLink = page.getByTestId("signup");
    this.signinError = page.getByTestId("signin-error");
  }

  public async clickSignInButton(): Promise<void> {
    await test.step("Click sign in button", async () => {
      await this.signInButton.click();
    });
  }

  public async login(username: string, password: string): Promise<void> {
    await test.step(`Perform full login for user: ${username}`, async () => {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.signInButton.click();
    });
  }

  public async goToSignup(): Promise<void> {
    await test.step("Click sign up link", async () => {
      await this.signUpLink.focus();
      await this.signUpLink.click();
    });
  }
}
