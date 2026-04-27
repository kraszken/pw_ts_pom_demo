import { Page } from "@playwright/test";
import { BankAccountsPage } from "./bank-accounts.page";
import { FeedPage } from "./feed.page";
import { HomePage } from "./home.page";
import { LoginPage } from "./login.page";
import { NotificationsPage } from "./notifications.page";
import { OnboardingPage } from "./onboarding.page";
import { TransactionCreatePage } from "./transaction-create.page";
import { TransactionDetailsPage } from "./transaction-details.page";
import { UserSettingsPage } from "./user-settings.page";

export class AppManager {
  private _bankAccountsPage?: BankAccountsPage;
  private _feedPage?: FeedPage;
  private _homePage?: HomePage;
  private _loginPage?: LoginPage;
  private _notificationsPage?: NotificationsPage;
  private _onboardingPage?: OnboardingPage;
  private _transactionCreatePage?: TransactionCreatePage;
  private _transactionDetailsPage?: TransactionDetailsPage;
  private _userSettingsPage?: UserSettingsPage;

  constructor(private readonly page: Page) {}

  public get bankAccountsPage(): BankAccountsPage {
    if (!this._bankAccountsPage) {
      this._bankAccountsPage = new BankAccountsPage(this.page);
    }
    return this._bankAccountsPage;
  }

  public get feedPage(): FeedPage {
    if (!this._feedPage) {
      this._feedPage = new FeedPage(this.page);
    }
    return this._feedPage;
  }

  public get homePage(): HomePage {
    if (!this._homePage) {
      this._homePage = new HomePage(this.page);
    }
    return this._homePage;
  }

  public get loginPage(): LoginPage {
    if (!this._loginPage) {
      this._loginPage = new LoginPage(this.page);
    }
    return this._loginPage;
  }

  public get notificationsPage(): NotificationsPage {
    if (!this._notificationsPage) {
      this._notificationsPage = new NotificationsPage(this.page);
    }
    return this._notificationsPage;
  }

  public get onboardingPage(): OnboardingPage {
    if (!this._onboardingPage) {
      this._onboardingPage = new OnboardingPage(this.page);
    }
    return this._onboardingPage;
  }

  public get transactionCreatePage(): TransactionCreatePage {
    if (!this._transactionCreatePage) {
      this._transactionCreatePage = new TransactionCreatePage(this.page);
    }
    return this._transactionCreatePage;
  }

  public get transactionDetailsPage(): TransactionDetailsPage {
    if (!this._transactionDetailsPage) {
      this._transactionDetailsPage = new TransactionDetailsPage(this.page);
    }
    return this._transactionDetailsPage;
  }

  public get userSettingsPage(): UserSettingsPage {
    if (!this._userSettingsPage) {
      this._userSettingsPage = new UserSettingsPage(this.page);
    }
    return this._userSettingsPage;
  }
}
