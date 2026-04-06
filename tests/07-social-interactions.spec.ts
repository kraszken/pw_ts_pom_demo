import { faker } from "@faker-js/faker";
import { env } from "process";
import { expect, test } from "../fixtures/test-base";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Social Interactions", () => {
  let activeUserId: string;

  test.beforeEach(async ({ page, apiClient, loginPage, feedPage }) => {
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

    await loginPage.navigate();
    await loginPage.login(mainUser.username, env.USERPASSWORD || "s3cret");
    await page.waitForURL("**/");

    await feedPage.navigate();
    await feedPage.clickPersonalTab();
    await feedPage.openTransactionAtIndex(0);
  });

  test("likes a transaction", async ({ transactionDetailsPage }) => {
    await expect(transactionDetailsPage.detailHeader).toBeVisible();

    const initialLikeCountText =
      await transactionDetailsPage.likeCount.textContent();
    const initialLikeCount = parseInt(initialLikeCountText || "0", 10);

    await transactionDetailsPage.clickLike();

    await expect(transactionDetailsPage.likeButton).toBeDisabled();
    await expect(transactionDetailsPage.likeCount).toHaveText(
      (initialLikeCount + 1).toString(),
    );
  });

  test("comments on a transaction", async ({ transactionDetailsPage }) => {
    await expect(transactionDetailsPage.detailHeader).toBeVisible();

    const commentText = faker.lorem.sentence();

    await transactionDetailsPage.submitComment(commentText);

    await expect(transactionDetailsPage.commentsList).toContainText(
      commentText,
    );
  });
});
