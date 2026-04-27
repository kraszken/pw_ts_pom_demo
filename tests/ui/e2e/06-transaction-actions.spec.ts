import { ENV } from "@config/env.config";
import { faker } from "@faker-js/faker";
import { expect, test } from "@src/fixtures/test-base";

test.describe("Transaction Actions & Feeds", () => {
  let activeUserId: string;

  test.beforeEach(async ({ page, apiClient, app }) => {
    const mainUser = await apiClient.createUniqueUser("Main");
    await apiClient.loginAndCreateBankAccount(mainUser.username);
    activeUserId = mainUser.id;

    await app.loginPage.navigate();
    await app.loginPage.login(mainUser.username, ENV.USER_PASSWORD);
    await page.waitForURL("**/");
  });

  test("accepts a pending transaction request", async ({ apiClient, app }) => {
    const externalUser = await apiClient.createUniqueUser("External");
    const description = `Request ${faker.string.alphanumeric(5)}`;

    await apiClient.loginAndCreateTransaction(
      externalUser.username,
      "request",
      activeUserId,
      250,
      description,
    );

    await app.feedPage.navigate();
    await app.feedPage.clickPersonalTab();
    await expect(app.feedPage.transactionItems.first()).toContainText(
      description,
    );

    await app.feedPage.openTransactionAtIndex(0);
    await expect(app.transactionDetailsPage.detailHeader).toBeVisible();
    await expect(app.transactionDetailsPage.acceptButton).toBeVisible();

    await app.transactionDetailsPage.acceptRequest();

    await expect(app.transactionDetailsPage.acceptButton).not.toBeVisible();
    await expect(app.transactionDetailsPage.detailHeader).toBeVisible();
  });

  test("rejects a pending transaction request", async ({ apiClient, app }) => {
    const externalUser = await apiClient.createUniqueUser("External");
    const description = `Request ${faker.string.alphanumeric(5)}`;

    await apiClient.loginAndCreateTransaction(
      externalUser.username,
      "request",
      activeUserId,
      500,
      description,
    );

    await app.feedPage.navigate();
    await app.feedPage.clickPersonalTab();
    await app.feedPage.openTransactionAtIndex(0);

    await expect(app.transactionDetailsPage.rejectButton).toBeVisible();
    await app.transactionDetailsPage.rejectRequest();

    await expect(app.transactionDetailsPage.rejectButton).not.toBeVisible();
    await expect(app.transactionDetailsPage.detailHeader).toBeVisible();
  });

  test("verifies visibility of transactions across tabs", async ({ app }) => {
    await app.feedPage.navigate();

    await app.feedPage.clickPersonalTab();
    await expect(app.feedPage.personalTab).toHaveClass(/Mui-selected/);

    await app.feedPage.clickContactsTab();
    await expect(app.feedPage.contactsTab).toHaveClass(/Mui-selected/);

    await app.feedPage.clickPublicTab();
    await expect(app.feedPage.publicTab).toHaveClass(/Mui-selected/);
    await expect(app.feedPage.transactionItems.first()).toBeVisible();
  });
});
