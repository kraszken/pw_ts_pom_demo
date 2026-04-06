import { faker } from "@faker-js/faker";
import { env } from "process";
import { expect, test } from "../fixtures/test-base";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Transaction Actions & Feeds", () => {
  let activeUserId: string;

  test.beforeEach(async ({ page, apiClient, loginPage }) => {
    const mainUser = await apiClient.createUniqueUser("Main");
    await apiClient.loginAndCreateBankAccount(mainUser.username);
    activeUserId = mainUser.id;

    await loginPage.navigate();
    await loginPage.login(mainUser.username, env.USERPASSWORD || "s3cret");
    await page.waitForURL("**/");
  });

  test("accepts a pending transaction request", async ({
    page,
    apiClient,
    feedPage,
    transactionDetailsPage,
  }) => {
    const externalUser = await apiClient.createUniqueUser("External");
    const description = `Request ${faker.string.alphanumeric(5)}`;

    await apiClient.loginAndCreateTransaction(
      externalUser.username,
      "request",
      activeUserId,
      250,
      description,
    );

    await feedPage.navigate();
    await feedPage.clickPersonalTab();
    await expect(feedPage.transactionItems.first()).toContainText(description);

    await feedPage.openTransactionAtIndex(0);
    await expect(transactionDetailsPage.detailHeader).toBeVisible();
    await expect(transactionDetailsPage.acceptButton).toBeVisible();

    await transactionDetailsPage.acceptRequest();

    await expect(transactionDetailsPage.acceptButton).not.toBeVisible();
    await expect(transactionDetailsPage.detailHeader).toBeVisible();
  });

  test("rejects a pending transaction request", async ({
    page,
    apiClient,
    feedPage,
    transactionDetailsPage,
  }) => {
    const externalUser = await apiClient.createUniqueUser("External");
    const description = `Request ${faker.string.alphanumeric(5)}`;

    await apiClient.loginAndCreateTransaction(
      externalUser.username,
      "request",
      activeUserId,
      500,
      description,
    );

    await feedPage.navigate();
    await feedPage.clickPersonalTab();
    await feedPage.openTransactionAtIndex(0);

    await expect(transactionDetailsPage.rejectButton).toBeVisible();
    await transactionDetailsPage.rejectRequest();

    await expect(transactionDetailsPage.rejectButton).not.toBeVisible();
    await expect(transactionDetailsPage.detailHeader).toBeVisible();
  });

  test("verifies visibility of transactions across tabs", async ({
    feedPage,
  }) => {
    await feedPage.navigate();

    await feedPage.clickPersonalTab();
    await expect(feedPage.personalTab).toHaveClass(/Mui-selected/);

    await feedPage.clickContactsTab();
    await expect(feedPage.contactsTab).toHaveClass(/Mui-selected/);

    await feedPage.clickPublicTab();
    await expect(feedPage.publicTab).toHaveClass(/Mui-selected/);
    await expect(feedPage.transactionItems.first()).toBeVisible();
  });
});
