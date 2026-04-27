import { ENV } from "@config/env.config";
import { faker } from "@faker-js/faker";
import { expect, test } from "@src/fixtures/test-base";

test.describe("Social Interactions", () => {
  let activeUserId: string;

  test.beforeEach(async ({ page, apiClient, app }) => {
    const mainUser = await apiClient.createUniqueUser("Main");
    await apiClient.loginAndCreateBankAccount(mainUser.username);
    activeUserId = mainUser.id;

    const externalUser = await apiClient.createUniqueUser("External");
    await apiClient.loginAndCreateBankAccount(externalUser.username);

    await apiClient.loginAndCreateTransaction(
      externalUser.username,
      "payment",
      activeUserId,
      150,
      faker.lorem.words(3),
    );

    await app.loginPage.navigate();
    await app.loginPage.login(mainUser.username, ENV.USER_PASSWORD);
    await page.waitForURL("**/");

    await app.feedPage.navigate();
    await app.feedPage.clickPersonalTab();
    await app.feedPage.openTransactionAtIndex(0);
  });

  test("likes a transaction", async ({ app }) => {
    await expect(app.transactionDetailsPage.detailHeader).toBeVisible();

    const initialLikeCountText =
      await app.transactionDetailsPage.likeCount.textContent();
    const initialLikeCount = Number.parseInt(initialLikeCountText || "0", 10);

    await app.transactionDetailsPage.clickLike();

    await expect(app.transactionDetailsPage.likeButton).toBeDisabled();
    await expect(app.transactionDetailsPage.likeCount).toHaveText(
      (initialLikeCount + 1).toString(),
    );
  });

  test("comments on a transaction", async ({ app }) => {
    await expect(app.transactionDetailsPage.detailHeader).toBeVisible();

    const commentText = faker.lorem.sentence();

    await app.transactionDetailsPage.submitComment(commentText);

    await expect(app.transactionDetailsPage.commentsList).toContainText(
      commentText,
    );
  });
});
