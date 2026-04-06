import { faker } from "@faker-js/faker";
import { ValidationData } from "../data/validation-data";
import { expect, test } from "../fixtures/test-base";

test.describe("User Settings", () => {
  test("renders the user settings form", async ({ page, userSettingsPage }) => {
    await expect(userSettingsPage.form).toBeVisible();
    await expect(page).toHaveURL(/.*\/user\/settings/);
  });

  test("should display user setting form errors", async ({
    userSettingsPage,
  }) => {
    const { invalid, expectedErrors } = ValidationData.userSettings;

    await userSettingsPage.fillFirstName(invalid.firstName);
    await userSettingsPage.clearFirstName();
    await userSettingsPage.triggerFocusLost("firstName");
    await expect(userSettingsPage.firstNameHelper).toHaveText(
      expectedErrors.firstNameMissing,
    );

    await userSettingsPage.fillLastName(invalid.lastName);
    await userSettingsPage.clearLastName();
    await userSettingsPage.triggerFocusLost("lastName");
    await expect(userSettingsPage.lastNameHelper).toHaveText(
      expectedErrors.lastNameMissing,
    );

    await userSettingsPage.fillEmail(invalid.emailNoDomain);
    await userSettingsPage.triggerFocusLost("email");
    await expect(userSettingsPage.emailHelper).toHaveText(
      expectedErrors.emailInvalid,
    );

    await userSettingsPage.fillPhoneNumber(invalid.phoneTooShort);
    await userSettingsPage.triggerFocusLost("phoneNumber");
    await expect(userSettingsPage.phoneNumberHelper).toHaveText(
      expectedErrors.phoneInvalid,
    );

    await expect(userSettingsPage.submitButton).toBeDisabled();
  });

  test("updates first name, last name, email and phone number", async ({
    page,
    userSettingsPage,
  }) => {
    const newFirstName = faker.person.firstName();

    await userSettingsPage.updateProfile(
      newFirstName,
      faker.person.lastName(),
      faker.internet.email(),
      faker.string.numeric(10),
    );

    await expect(page.getByTestId("sidenav-user-full-name")).toContainText(
      newFirstName,
    );
  });
});
