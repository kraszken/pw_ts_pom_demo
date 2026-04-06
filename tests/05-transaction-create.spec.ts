import { faker } from "@faker-js/faker";
import { ValidationData } from "../data/validation-data";
import { expect, test } from "../fixtures/test-base";
import { User } from "../types/models";

test.describe("Transaction Creation", () => {
  let contactUser: User;
  const { invalid, expectedErrors } = ValidationData.transaction;

  test.beforeEach(async ({ apiClient }) => {
    contactUser = await apiClient.createUniqueUser("Contact");
  });

  test("searches for a user by name", async ({ transactionCreatePage }) => {
    await transactionCreatePage.searchUser(contactUser.username);
    await expect(
      transactionCreatePage.getUserListItem(contactUser.username),
    ).toBeVisible();

    await transactionCreatePage.clearSearch();
    await expect(transactionCreatePage.userList).toBeEmpty();
  });

  test("searches for a user by email", async ({ transactionCreatePage }) => {
    await transactionCreatePage.searchUser(contactUser.email);
    await expect(
      transactionCreatePage.getUserListItem(contactUser.username),
    ).toBeVisible();
  });

  test("searches for a user by phone number", async ({
    transactionCreatePage,
  }) => {
    await transactionCreatePage.searchUser(contactUser.phoneNumber);
    await expect(
      transactionCreatePage.getUserListItem(contactUser.username),
    ).toBeVisible();
  });

  test("submits a transaction payment", async ({ transactionCreatePage }) => {
    await transactionCreatePage.searchUser(contactUser.username);
    await transactionCreatePage.selectUser(contactUser.username);
    await transactionCreatePage.fillTransactionDetails(
      "50",
      faker.lorem.words(3),
    );
    await transactionCreatePage.submitPayment();

    await expect(transactionCreatePage.successAlert).toHaveText(
      "Transaction Submitted!",
    );
  });

  test("submits a transaction request", async ({ transactionCreatePage }) => {
    await transactionCreatePage.searchUser(contactUser.username);
    await transactionCreatePage.selectUser(contactUser.username);
    await transactionCreatePage.fillTransactionDetails(
      "150",
      faker.lorem.words(3),
    );
    await transactionCreatePage.submitRequest();

    await expect(transactionCreatePage.successAlert).toHaveText(
      "Transaction Submitted!",
    );
  });

  test("displays new transaction form errors", async ({
    transactionCreatePage,
  }) => {
    await transactionCreatePage.searchUser(contactUser.username);
    await transactionCreatePage.selectUser(contactUser.username);

    await transactionCreatePage.fillAmount(invalid.amount);
    await transactionCreatePage.clearAmount();
    await transactionCreatePage.triggerFocusLost("amount");
    await expect(transactionCreatePage.amountHelper).toHaveText(
      expectedErrors.amountInvalid,
    );

    await transactionCreatePage.fillDescription("Note");
    await transactionCreatePage.clearDescription();
    await transactionCreatePage.triggerFocusLost("description");
    await expect(transactionCreatePage.descriptionHelper).toHaveText(
      expectedErrors.descriptionMissing,
    );

    await expect(transactionCreatePage.submitPaymentButton).toBeDisabled();
    await expect(transactionCreatePage.submitRequestButton).toBeDisabled();
  });
});
