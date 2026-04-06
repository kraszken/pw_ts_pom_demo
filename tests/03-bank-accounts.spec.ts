import { faker } from "@faker-js/faker";
import { ValidationData } from "../data/validation-data";
import { expect, test } from "../fixtures/test-base";

test.describe("Bank Accounts", () => {
  const { invalid, expectedErrors } = ValidationData.bankAccounts;

  test("creates a new bank account", async ({ page, bankAccountsPage }) => {
    const newBankName = `${faker.company.name()} Bank`;

    await bankAccountsPage.initiateNewAccountCreation();

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/graphql") && response.status() === 200,
    );
    await bankAccountsPage.fillAndSubmitAccountDetails(
      newBankName,
      faker.string.numeric(9),
      faker.string.numeric(10),
    );
    await responsePromise;

    await expect(
      bankAccountsPage.getAccountListItemByName(newBankName),
    ).toBeVisible();
  });

  test("should display bank account form errors", async ({
    bankAccountsPage,
  }) => {
    await bankAccountsPage.initiateNewAccountCreation();

    await bankAccountsPage.fillBankName(invalid.bankNameTooShort);
    await bankAccountsPage.triggerFocusLost("bankName");
    await expect(bankAccountsPage.bankNameHelper).toHaveText(
      expectedErrors.bankNameLength,
    );

    await bankAccountsPage.clearBankName();
    await bankAccountsPage.triggerFocusLost("bankName");
    await expect(bankAccountsPage.bankNameHelper).toHaveText(
      expectedErrors.bankNameMissing,
    );

    await bankAccountsPage.triggerFocusLost("routingNumber");
    await expect(bankAccountsPage.routingNumberHelper).toHaveText(
      expectedErrors.routingNumberMissing,
    );

    await bankAccountsPage.fillRoutingNumber(invalid.routingNumberTooShort);
    await bankAccountsPage.triggerFocusLost("routingNumber");
    await expect(bankAccountsPage.routingNumberHelper).toHaveText(
      expectedErrors.routingNumberLength,
    );

    await bankAccountsPage.triggerFocusLost("accountNumber");
    await expect(bankAccountsPage.accountNumberHelper).toHaveText(
      expectedErrors.accountNumberMissing,
    );

    await bankAccountsPage.fillAccountNumber(invalid.accountNumberTooShort);
    await bankAccountsPage.triggerFocusLost("accountNumber");
    await expect(bankAccountsPage.accountNumberHelper).toHaveText(
      expectedErrors.accountNumberMinLength,
    );

    await bankAccountsPage.fillAccountNumber(invalid.accountNumberTooLong);
    await bankAccountsPage.triggerFocusLost("accountNumber");
    await expect(bankAccountsPage.accountNumberHelper).toHaveText(
      expectedErrors.accountNumberMaxLength,
    );

    await expect(bankAccountsPage.submitButton).toBeDisabled();
  });

  test("soft deletes a bank account", async ({ page, bankAccountsPage }) => {
    const bankNameToDelete = `${faker.company.name()} Bank`;

    await bankAccountsPage.initiateNewAccountCreation();
    const createPromise = page.waitForResponse(
      (response) =>
        response.url().includes("/graphql") && response.status() === 200,
    );
    await bankAccountsPage.fillAndSubmitAccountDetails(
      bankNameToDelete,
      faker.string.numeric(9),
      faker.string.numeric(10),
    );
    await createPromise;

    const deletePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/graphql") && response.status() === 200,
    );
    await bankAccountsPage.deleteAccountByName(bankNameToDelete);
    await deletePromise;

    await expect(
      bankAccountsPage
        .getAccountListItemByName(bankNameToDelete)
        .getByText("Deleted"),
    ).toBeVisible();
  });
});
