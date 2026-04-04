import { expect, test } from "@playwright/test";
import { env } from "process";
import database from "../data/database.json";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login Form Validation", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.navigate();
  });

  const userHeath: string = database.users[0].username;

  test.describe("Login - postitive", () => {
    test("Successful login with valid credentials", async () => {
      await loginPage.login(userHeath, env.USERPASSWORD!);
      await expect(homePage.sidenavUsername).toHaveText(`@${userHeath}`);
    });
  });

  test.describe("Login - frontend validation", () => {
    test("Login with empty username and password", async () => {
      await loginPage.clickSignInButton();
      await expect(loginPage.signInButton).toHaveAttribute("disabled");
    });

    test("Validate Username field after focus lost", async () => {
      await loginPage.inputFocusLost("username");
      await expect(loginPage.usernameHelper).toHaveText("Username is required");
    });

    test("Validate minimum Password length requirement", async () => {
      await loginPage.enterUsername(userHeath);
      await loginPage.enterPassword("asd");
      await loginPage.inputFocusLost("password");
      await expect(loginPage.passwordHelper).toHaveText(
        "Password must contain at least 4 characters",
      );
    });
  });
  test.describe("Login - negative", () => {
    test("Login with wrong password", async () => {
      await loginPage.enterUsername(userHeath);
      await loginPage.enterPassword("wrongpassword");
      await loginPage.clickSignInButton();
      await expect(loginPage.signinError).toHaveText(
        "Username or password is invalid",
      );
    });
  });
});
