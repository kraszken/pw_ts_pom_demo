import { ENV } from "@config/env.config";
import { BankAccountFactory } from "@src/factories/bank-account.factory";
import { expect, test } from "@src/fixtures/test-base";

test.describe("User Onboarding", () => {
  test.beforeEach(async ({ page, apiClient, app }) => {
    const newUser = await apiClient.createUniqueUser("Onboard");

    await app.loginPage.navigate();
    await app.loginPage.login(newUser.username, ENV.USER_PASSWORD);
    await page.waitForURL("**/");
  });

  test("should complete onboarding process", async ({ page, app }) => {
    const bankAccount = BankAccountFactory.createValidBankAccount();

    await expect(app.onboardingPage.dialog).toBeVisible();
    await expect(app.onboardingPage.dialogTitle).toContainText("Get Started");

    await app.onboardingPage.clickNext();

    await expect(app.onboardingPage.dialogTitle).toContainText(
      "Create Bank Account",
    );

    const responsePromise = page.waitForResponse("**/graphql");
    await app.onboardingPage.submitBankDetails(
      bankAccount.bankName,
      bankAccount.routingNumber,
      bankAccount.accountNumber,
    );
    await responsePromise;

    await expect(app.onboardingPage.dialogTitle).toContainText("Finished");

    await app.onboardingPage.clickNext();

    await expect(app.onboardingPage.dialog).not.toBeVisible();
    await expect(page.getByTestId("transaction-list")).toBeVisible();
  });
});
