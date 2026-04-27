import { ENV } from "@config/env.config";
import { BankAccountFactory } from "@src/factories/bank-account.factory";
import { expect, test } from "@src/fixtures/test-base";
import { ValidationData } from "@src/test-data/validation-data";

test.describe("Bank Accounts", () => {
  const { invalid, expectedErrors } = ValidationData.bankAccounts;

  test.beforeEach(async ({ page, apiClient, app }) => {
    const user = await apiClient.createUniqueUser("BankUser");
    await apiClient.loginAndCreateBankAccount(user.username);

    await app.loginPage.navigate();
    await app.loginPage.login(user.username, ENV.USER_PASSWORD);
    await page.waitForURL("**/");
  });

  test("creates a new bank account", async ({ page, app }) => {
    const accountData = BankAccountFactory.createValidBankAccount();

    await app.bankAccountsPage.navigate();
    await app.bankAccountsPage.initiateNewAccountCreation();

    const responsePromise = page.waitForResponse(
      (res) =>
        res.url().includes("/graphql") &&
        res.request().method() === "POST" &&
        (res.request().postData()?.includes("CreateBankAccount") ?? false),
    );
    await app.bankAccountsPage.fillAndSubmitAccountDetails(
      accountData.bankName,
      accountData.routingNumber,
      accountData.accountNumber,
    );
    await responsePromise;

    await expect(
      app.bankAccountsPage.getAccountListItemByName(accountData.bankName),
    ).toBeVisible();
  });

  test("should display bank account form errors", async ({ app }) => {
    await app.bankAccountsPage.navigate();
    await app.bankAccountsPage.initiateNewAccountCreation();

    await app.bankAccountsPage.bankNameInput.fill(invalid.bankNameTooShort);
    await app.bankAccountsPage.bankNameInput.blur();
    await expect(app.bankAccountsPage.bankNameInput.helperText).toHaveText(
      expectedErrors.bankNameLength,
    );

    await app.bankAccountsPage.bankNameInput.clear();
    await app.bankAccountsPage.bankNameInput.blur();
    await expect(app.bankAccountsPage.bankNameInput.helperText).toHaveText(
      expectedErrors.bankNameMissing,
    );

    await app.bankAccountsPage.routingNumberInput.blur();
    await expect(app.bankAccountsPage.routingNumberInput.helperText).toHaveText(
      expectedErrors.routingNumberMissing,
    );

    await app.bankAccountsPage.routingNumberInput.fill(
      invalid.routingNumberTooShort,
    );
    await app.bankAccountsPage.routingNumberInput.blur();
    await expect(app.bankAccountsPage.routingNumberInput.helperText).toHaveText(
      expectedErrors.routingNumberLength,
    );

    await app.bankAccountsPage.accountNumberInput.blur();
    await expect(app.bankAccountsPage.accountNumberInput.helperText).toHaveText(
      expectedErrors.accountNumberMissing,
    );

    await app.bankAccountsPage.accountNumberInput.fill(
      invalid.accountNumberTooShort,
    );
    await app.bankAccountsPage.accountNumberInput.blur();
    await expect(app.bankAccountsPage.accountNumberInput.helperText).toHaveText(
      expectedErrors.accountNumberMinLength,
    );

    await app.bankAccountsPage.accountNumberInput.fill(
      invalid.accountNumberTooLong,
    );
    await app.bankAccountsPage.accountNumberInput.blur();
    await expect(app.bankAccountsPage.accountNumberInput.helperText).toHaveText(
      expectedErrors.accountNumberMaxLength,
    );

    await expect(app.bankAccountsPage.submitButton).toBeDisabled();
  });

  test("soft deletes a bank account", async ({ page, app }) => {
    const accountData = BankAccountFactory.createValidBankAccount();

    await app.bankAccountsPage.navigate();
    await app.bankAccountsPage.initiateNewAccountCreation();

    const createPromise = page.waitForResponse(
      (res) =>
        res.url().includes("/graphql") &&
        res.request().method() === "POST" &&
        (res.request().postData()?.includes("CreateBankAccount") ?? false),
    );
    await app.bankAccountsPage.fillAndSubmitAccountDetails(
      accountData.bankName,
      accountData.routingNumber,
      accountData.accountNumber,
    );
    await createPromise;

    const deletePromise = page.waitForResponse(
      (res) =>
        res.url().includes("/graphql") &&
        res.request().method() === "POST" &&
        (res.request().postData()?.includes("DeleteBankAccount") ?? false),
    );
    await app.bankAccountsPage.deleteAccountByName(accountData.bankName);
    await deletePromise;

    await expect(
      app.bankAccountsPage
        .getAccountListItemByName(accountData.bankName)
        .getByText("Deleted"),
    ).toBeVisible();
  });
});
