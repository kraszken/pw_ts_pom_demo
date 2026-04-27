import { ENV } from "@config/env.config";
import { UserFactory } from "@src/factories/user.factory";
import { expect, test } from "@src/fixtures/test-base";
import { ValidationData } from "@src/test-data/validation-data";

test.describe("User Settings", () => {
  test.beforeEach(async ({ page, apiClient, app }) => {
    const uniqueUser = await apiClient.createUniqueUser("SettingsUser");
    await apiClient.loginAndCreateBankAccount(uniqueUser.username);

    await app.loginPage.navigate();
    await app.loginPage.login(uniqueUser.username, ENV.USER_PASSWORD);
    await page.waitForURL("**/");
  });

  test("renders the user settings form", async ({ page, app }) => {
    await app.userSettingsPage.navigate();
    await expect(app.userSettingsPage.form).toBeVisible();
    await expect(page).toHaveURL(/.*\/user\/settings/);
  });

  test("should display user setting form errors", async ({ app }) => {
    await app.userSettingsPage.navigate();
    const { invalid, expectedErrors } = ValidationData.userSettings;

    await app.userSettingsPage.firstNameInput.fill(invalid.firstName);
    await app.userSettingsPage.firstNameInput.clear();
    await app.userSettingsPage.firstNameInput.blur();
    await expect(app.userSettingsPage.firstNameInput.helperText).toHaveText(
      expectedErrors.firstNameMissing,
    );

    await app.userSettingsPage.lastNameInput.fill(invalid.lastName);
    await app.userSettingsPage.lastNameInput.clear();
    await app.userSettingsPage.lastNameInput.blur();
    await expect(app.userSettingsPage.lastNameInput.helperText).toHaveText(
      expectedErrors.lastNameMissing,
    );

    await app.userSettingsPage.emailInput.fill(invalid.emailNoDomain);
    await app.userSettingsPage.emailInput.blur();
    await expect(app.userSettingsPage.emailInput.helperText).toHaveText(
      expectedErrors.emailInvalid,
    );

    await app.userSettingsPage.phoneNumberInput.fill(invalid.phoneTooShort);
    await app.userSettingsPage.phoneNumberInput.blur();
    await expect(app.userSettingsPage.phoneNumberInput.helperText).toHaveText(
      expectedErrors.phoneInvalid,
    );

    await expect(app.userSettingsPage.submitButton).toBeDisabled();
  });

  test("updates first name, last name, email and phone number", async ({
    page,
    app,
  }) => {
    await app.userSettingsPage.navigate();
    const updateData = UserFactory.createUpdateProfilePayload();

    await app.userSettingsPage.updateProfile(
      updateData.firstName,
      updateData.lastName,
      updateData.email,
      updateData.phoneNumber,
    );

    await expect(page.getByTestId("sidenav-user-full-name")).toContainText(
      updateData.firstName,
    );

    await expect(page.getByTestId("sidenav-user-full-name")).toContainText(
      updateData.lastName.charAt(0),
    );
  });
});
