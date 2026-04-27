import { ENV } from "@config/env.config";
import { User } from "@src/api/models/types";
import { expect, test } from "@src/fixtures/test-base";
import { ValidationData } from "@src/test-data/validation-data";

test.describe("Login Form Validation", () => {
  let validUser: User;
  const { invalid, expectedErrors } = ValidationData.login;

  test.beforeEach(async ({ apiClient, app }) => {
    validUser = await apiClient.createUniqueUser("LoginUser");
    await app.loginPage.navigate();
  });

  test.describe("Login - positive", () => {
    test("Successful login with valid credentials", async ({ app }) => {
      await app.loginPage.login(validUser.username, ENV.USER_PASSWORD);
      await expect(app.homePage.sidenavUsername).toHaveText(
        `@${validUser.username}`,
      );
    });
  });

  test.describe("Login - frontend validation", () => {
    test("Login with empty username and password", async ({ app }) => {
      await app.loginPage.clickSignInButton();
      await expect(app.loginPage.signInButton).toBeDisabled();
    });

    test("Validate Username field after focus lost", async ({ app }) => {
      await app.loginPage.usernameInput.blur();
      await expect(app.loginPage.usernameInput.helperText).toHaveText(
        expectedErrors.usernameMissing,
      );
    });

    test("Validate minimum Password length requirement", async ({ app }) => {
      await app.loginPage.usernameInput.fill(validUser.username);
      await app.loginPage.passwordInput.fill(invalid.passwordTooShort);
      await app.loginPage.passwordInput.blur();

      await expect(app.loginPage.passwordInput.helperText).toHaveText(
        expectedErrors.passwordLength,
      );
    });

    test("Password field should mask input characters", async ({ app }) => {
      await expect(app.loginPage.passwordInput.locator).toHaveAttribute(
        "type",
        "password",
      );
    });
  });

  test.describe("Login - negative", () => {
    test("Login with wrong password", async ({ app }) => {
      await app.loginPage.usernameInput.fill(validUser.username);
      await app.loginPage.passwordInput.fill(invalid.wrongPassword);
      await app.loginPage.clickSignInButton();

      await expect(app.loginPage.signinError).toHaveText(
        expectedErrors.invalidCredentials,
      );
    });

    test("Login with non existing user", async ({ app }) => {
      await app.loginPage.usernameInput.fill(invalid.nonExistingUser);
      await app.loginPage.passwordInput.fill(ENV.USER_PASSWORD);
      await app.loginPage.clickSignInButton();

      await expect(app.loginPage.signinError).toHaveText(
        expectedErrors.invalidCredentials,
      );
    });
  });

  test.describe("Login - edge cases", () => {
    test("Password case sensitivity verification", async ({ app }) => {
      await app.loginPage.usernameInput.fill(validUser.username);
      await app.loginPage.passwordInput.fill(
        ENV.USER_PASSWORD.toLocaleUpperCase(),
      );
      await app.loginPage.clickSignInButton();

      await expect(app.loginPage.signinError).toHaveText(
        expectedErrors.invalidCredentials,
      );
    });
  });

  test.describe("Login - Accessibility / A11y", () => {
    test("Login using keyboard", async ({ app }) => {
      await app.loginPage.usernameInput.fill(validUser.username);
      await app.loginPage.passwordInput.fill(ENV.USER_PASSWORD);
      await app.loginPage.passwordInput.pressEnter();

      await expect(app.homePage.sidenavUsername).toHaveText(
        `@${validUser.username}`,
      );
    });

    test("Register route", async ({ page, app }) => {
      await app.loginPage.goToSignup();
      await expect(page).toHaveURL(/.*signup/);
    });
  });
});
