import { faker } from "@faker-js/faker";
import { env } from "process";
import { expect, test } from "../fixtures/test-base";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Notifications", () => {
  let activeUserId: string;

  test.beforeEach(async ({ page, apiClient, loginPage }) => {
    const mainUser = await apiClient.createUniqueUser("Main");
    await apiClient.loginAndCreateBankAccount(mainUser.username);
    activeUserId = mainUser.id;

    const externalUser = await apiClient.createUniqueUser("External");
    await apiClient.loginAndCreateBankAccount(externalUser.username);

    const transaction = await apiClient.loginAndCreateTransaction(
      externalUser.username,
      "payment",
      activeUserId,
      100,
      faker.lorem.words(3),
    );

    await apiClient.loginAndLikeTransaction(
      externalUser.username,
      transaction.id,
    );

    await loginPage.navigate();
    await loginPage.login(mainUser.username, env.USERPASSWORD || "s3cret");
    await page.waitForURL("**/");
  });

  test("displays unread notifications and badge count", async ({
    page,
    homePage,
    notificationsPage,
  }) => {
    await page.goto("/");

    await expect(homePage.notificationsBadge).toHaveText("2");

    await homePage.clickNotificationsLink();

    await expect(notificationsPage.notificationItems).toHaveCount(2);
  });

  test("marks notification as read", async ({
    notificationsPage,
    homePage,
  }) => {
    await expect(notificationsPage.notificationItems).toHaveCount(2);

    await notificationsPage.markAsReadAtIndex(0);

    await expect(notificationsPage.notificationItems).toHaveCount(1);
    await expect(homePage.notificationsBadge).toHaveText("1");
  });

  test("displays empty state when all notifications are read", async ({
    notificationsPage,
  }) => {
    const count = await notificationsPage.notificationItems.count();

    for (let i = 0; i < count; i++) {
      await notificationsPage.markAsReadAtIndex(0);
    }

    await expect(notificationsPage.notificationItems).toHaveCount(0);
    await expect(notificationsPage.emptyListHeader).toBeVisible();
  });
});
