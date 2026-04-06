import { env } from "process";
import { ValidationData } from "../data/validation-data";
import { expect, test } from "../fixtures/test-base";
import { User } from "../types/models";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login Form Validation", () => {
  let validUser: User;
  const { invalid, expectedErrors } = ValidationData.login;

  test.beforeEach(async ({ apiClient, loginPage }) => {
    validUser = await apiClient.createUniqueUser("LoginUser");
    await loginPage.navigate();
  });

  test.describe("Login - positive", () => {
    test("Successful login with valid credentials", async ({
      loginPage,
      homePage,
    }) => {
      await loginPage.login(validUser.username, env.USERPASSWORD!);
      await expect(homePage.sidenavUsername).toHaveText(
        `@${validUser.username}`,
      );
    });
  });

  test.describe("Login - frontend validation", () => {
    test("Login with empty username and password", async ({ loginPage }) => {
      await loginPage.clickSignInButton();
      await expect(loginPage.signInButton).toBeDisabled();
    });

    test("Validate Username field after focus lost", async ({ loginPage }) => {
      await loginPage.triggerFocusLost("username");
      await expect(loginPage.usernameHelper).toHaveText(
        expectedErrors.usernameMissing,
      );
    });

    test("Validate minimum Password length requirement", async ({
      loginPage,
    }) => {
      await loginPage.fillUsername(validUser.username);
      await loginPage.fillPassword(invalid.passwordTooShort);
      await loginPage.triggerFocusLost("password");
      await expect(loginPage.passwordHelper).toHaveText(
        expectedErrors.passwordLength,
      );
    });

    test("Password field should mask input characters", async ({
      loginPage,
    }) => {
      await expect(loginPage.passwordField).toHaveAttribute("type", "password");
    });
  });

  test.describe("Login - negative", () => {
    test("Login with wrong password", async ({ loginPage }) => {
      await loginPage.fillUsername(validUser.username);
      await loginPage.fillPassword(invalid.wrongPassword);
      await loginPage.clickSignInButton();
      await expect(loginPage.signinError).toHaveText(
        expectedErrors.invalidCredentials,
      );
    });

    test("Login with non existing user", async ({ loginPage }) => {
      await loginPage.fillUsername(invalid.nonExistingUser);
      await loginPage.fillPassword(env.USERPASSWORD!);
      await loginPage.clickSignInButton();
      await expect(loginPage.signinError).toHaveText(
        expectedErrors.invalidCredentials,
      );
    });
  });

  test.describe("Login - edge cases", () => {
    test("Password case sensitivity verification", async ({ loginPage }) => {
      await loginPage.fillUsername(validUser.username);
      await loginPage.fillPassword(env.USERPASSWORD!.toLocaleUpperCase());
      await loginPage.clickSignInButton();
      await expect(loginPage.signinError).toHaveText(
        expectedErrors.invalidCredentials,
      );
    });
  });

  test.describe("Login - Accessibility / A11y", () => {
    test("Login using keyboard", async ({ loginPage, homePage }) => {
      await loginPage.fillUsername(validUser.username);
      await loginPage.enterPasswordAndSubmit(env.USERPASSWORD!);
      await expect(homePage.sidenavUsername).toHaveText(
        `@${validUser.username}`,
      );
    });

    test("Register route", async ({ page, loginPage }) => {
      await loginPage.goToSignup();
      await expect(page).toHaveURL(/.*signup/);
    });
  });
});
