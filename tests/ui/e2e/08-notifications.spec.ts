import { ENV } from "@config/env.config";
import { faker } from "@faker-js/faker";
import { expect, test } from "@src/fixtures/test-base";

test.describe("Notifications", () => {
  let activeUserId: string;

  test.beforeEach(async ({ page, apiClient, app }) => {
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

    await app.loginPage.navigate();
    await app.loginPage.login(mainUser.username, ENV.USER_PASSWORD);
    await page.waitForURL("**/");
  });

  test("displays unread notifications and badge count", async ({
    page,
    app,
  }) => {
    await page.goto("/");

    await expect(app.homePage.notificationsBadge).toHaveText("2");

    await app.homePage.clickNotificationsLink();

    await expect(app.notificationsPage.notificationItems).toHaveCount(2);
  });

  test("marks notification as read", async ({ app }) => {
    // FIX: Dodano brakującą nawigację do strony powiadomień przed asercjami
    await app.notificationsPage.navigate();

    await expect(app.notificationsPage.notificationItems).toHaveCount(2);
    await app.notificationsPage.markAsReadAtIndex(0);

    await expect(app.notificationsPage.notificationItems).toHaveCount(1);
    await expect(app.homePage.notificationsBadge).toHaveText("1");
  });

  test("displays empty state when all notifications are read", async ({
    app,
  }) => {
    // FIX: Dodano brakującą nawigację
    await app.notificationsPage.navigate();

    const count = await app.notificationsPage.notificationItems.count();

    for (let i = 0; i < count; i++) {
      await app.notificationsPage.markAsReadAtIndex(0);
    }

    await expect(app.notificationsPage.notificationItems).toHaveCount(0);
    await expect(app.notificationsPage.emptyListHeader).toBeVisible();
  });
});
