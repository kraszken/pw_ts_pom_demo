import { ENV } from "@config/env.config";
import { User } from "@src/api/models/types";
import { TransactionFactory } from "@src/factories/transaction.factory";
import { expect, test } from "@src/fixtures/test-base";
import { ValidationData } from "@src/test-data/validation-data";

test.describe("Transaction Creation", () => {
  let contactUser: User;
  const { invalid, expectedErrors } = ValidationData.transaction;

  test.beforeEach(async ({ page, apiClient, app }) => {
    contactUser = await apiClient.createUniqueUser("Contact");
    await apiClient.loginAndCreateBankAccount(contactUser.username);

    const mainUser = await apiClient.createUniqueUser("TxUser");
    await apiClient.loginAndCreateBankAccount(mainUser.username);

    await app.loginPage.navigate();
    await app.loginPage.login(mainUser.username, ENV.USER_PASSWORD);
    await page.waitForURL("**/");
  });

  test("searches for a user by name", async ({ app }) => {
    await app.transactionCreatePage.navigate();
    await app.transactionCreatePage.searchUser(contactUser.username);
    await expect(
      app.transactionCreatePage.getUserListItem(contactUser.username),
    ).toBeVisible();

    await app.transactionCreatePage.clearSearch();
    await expect(app.transactionCreatePage.userList).not.toBeEmpty();
  });

  test("searches for a user by email", async ({ app }) => {
    await app.transactionCreatePage.navigate();
    await app.transactionCreatePage.searchUser(contactUser.email);
    await expect(
      app.transactionCreatePage.getUserListItem(contactUser.username),
    ).toBeVisible();
  });

  test("searches for a user by phone number", async ({ app }) => {
    await app.transactionCreatePage.navigate();
    await app.transactionCreatePage.searchUser(contactUser.phoneNumber);
    await expect(
      app.transactionCreatePage.getUserListItem(contactUser.username),
    ).toBeVisible();
  });

  test("submits a transaction payment", async ({ app }) => {
    await app.transactionCreatePage.navigate();
    const txData = TransactionFactory.createValidTransactionData();

    await app.transactionCreatePage.searchUser(contactUser.username);
    await app.transactionCreatePage.selectUser(contactUser.username);
    await app.transactionCreatePage.fillTransactionDetails(
      txData.amount,
      txData.description,
    );
    await app.transactionCreatePage.submitPayment();

    await expect(app.transactionCreatePage.successAlert).toHaveText(
      "Transaction Submitted!",
    );
  });

  test("submits a transaction request", async ({ app }) => {
    await app.transactionCreatePage.navigate();
    const txData = TransactionFactory.createValidTransactionData();

    await app.transactionCreatePage.searchUser(contactUser.username);
    await app.transactionCreatePage.selectUser(contactUser.username);
    await app.transactionCreatePage.fillTransactionDetails(
      txData.amount,
      txData.description,
    );
    await app.transactionCreatePage.submitRequest();

    await expect(app.transactionCreatePage.successAlert).toHaveText(
      "Transaction Submitted!",
    );
  });

  test("displays new transaction form errors", async ({ app }) => {
    await app.transactionCreatePage.navigate();
    await app.transactionCreatePage.searchUser(contactUser.username);
    await app.transactionCreatePage.selectUser(contactUser.username);

    await app.transactionCreatePage.amountInput.fill(invalid.amount);
    await app.transactionCreatePage.amountInput.clear();
    await app.transactionCreatePage.amountInput.blur();
    await expect(app.transactionCreatePage.amountInput.helperText).toHaveText(
      expectedErrors.amountInvalid,
    );

    await app.transactionCreatePage.descriptionInput.fill("Note");
    await app.transactionCreatePage.descriptionInput.clear();
    await app.transactionCreatePage.descriptionInput.blur();
    await expect(
      app.transactionCreatePage.descriptionInput.helperText,
    ).toHaveText(expectedErrors.descriptionMissing);

    await expect(app.transactionCreatePage.submitPaymentButton).toBeDisabled();
    await expect(app.transactionCreatePage.submitRequestButton).toBeDisabled();
  });
});
