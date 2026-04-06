import { faker } from "@faker-js/faker";
import { env } from "process";
import { expect, test } from "../fixtures/test-base";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("User Onboarding", () => {
  test.beforeEach(async ({ page, apiClient, loginPage }) => {
    const newUser = await apiClient.createUniqueUser("Onboard");

    await loginPage.navigate();
    await loginPage.login(newUser.username, env.USERPASSWORD || "s3cret");
    await page.waitForURL("**/");
  });

  test("should complete onboarding process", async ({
    page,
    onboardingPage,
  }) => {
    const newBankName = `${faker.company.name()} Bank`;
    const routingNumber = faker.string.numeric(9);
    const accountNumber = faker.string.numeric(10);

    await expect(onboardingPage.dialog).toBeVisible();
    await expect(onboardingPage.dialogTitle).toContainText("Get Started");

    await onboardingPage.clickNext();

    await expect(onboardingPage.dialogTitle).toContainText(
      "Create Bank Account",
    );

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/graphql") && response.status() === 200,
    );
    await onboardingPage.submitBankDetails(
      newBankName,
      routingNumber,
      accountNumber,
    );
    await responsePromise;

    await expect(onboardingPage.dialogTitle).toContainText("Finished");

    await onboardingPage.clickNext();

    await expect(onboardingPage.dialog).not.toBeVisible();
    await expect(page.getByTestId("transaction-list")).toBeVisible();
  });
});
