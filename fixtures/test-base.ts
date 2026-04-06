import { test as base } from "@playwright/test";
import { BankAccountsPage } from "../pages/BankAccountsPage";
import { FeedPage } from "../pages/FeedPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { OnboardingPage } from "../pages/OnboardingPage";
import { TransactionCreatePage } from "../pages/TransactionCreatePage";
import { TransactionDetailsPage } from "../pages/TransactionDetailsPage";
import { UserSettingsPage } from "../pages/UserSettingsPage";
import { ApiClient } from "../utils/api-client";

type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  onboardingPage: OnboardingPage;
  bankAccountsPage: BankAccountsPage;
  userSettingsPage: UserSettingsPage;
  transactionCreatePage: TransactionCreatePage;
  feedPage: FeedPage;
  transactionDetailsPage: TransactionDetailsPage;
  notificationsPage: NotificationsPage;
  apiClient: ApiClient;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  onboardingPage: async ({ page }, use) => {
    await use(new OnboardingPage(page));
  },
  bankAccountsPage: async ({ page }, use) => {
    const bp = new BankAccountsPage(page);
    await bp.navigate();
    await use(bp);
  },
  userSettingsPage: async ({ page }, use) => {
    const up = new UserSettingsPage(page);
    await up.navigate();
    await use(up);
  },
  transactionCreatePage: async ({ page }, use) => {
    const tp = new TransactionCreatePage(page);
    await tp.navigate();
    await use(tp);
  },
  feedPage: async ({ page }, use) => {
    const fp = new FeedPage(page);
    await fp.navigate();
    await use(fp);
  },
  transactionDetailsPage: async ({ page }, use) => {
    await use(new TransactionDetailsPage(page));
  },
  notificationsPage: async ({ page }, use) => {
    const np = new NotificationsPage(page);
    await np.navigate();
    await use(np);
  },
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
});

export { expect } from "@playwright/test";
