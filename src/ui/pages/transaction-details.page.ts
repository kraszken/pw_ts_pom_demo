import { Locator, Page, test } from "@playwright/test";
import { BasePage } from "./base.page";

export class TransactionDetailsPage extends BasePage {
  public readonly detailHeader: Locator;
  public readonly acceptButton: Locator;
  public readonly rejectButton: Locator;
  public readonly likeButton: Locator;
  public readonly likeCount: Locator;
  public readonly commentsList: Locator;

  private readonly commentInput: Locator;

  constructor(page: Page) {
    super(page, "");

    this.detailHeader = page.getByTestId("transaction-detail-header");

    this.acceptButton = page.getByTestId(/transaction-accept-request-.*/);
    this.rejectButton = page.getByTestId(/transaction-reject-request-.*/);
    this.likeButton = page.getByTestId(/transaction-like-button-.*/);
    this.likeCount = page.getByTestId(/transaction-like-count-.*/);
    this.commentInput = page.getByTestId(/transaction-comment-input-.*/);

    this.commentsList = page.getByTestId("comments-list");
  }

  public async acceptRequest(): Promise<void> {
    await test.step("Accept transaction request", async () => {
      const responsePromise = this.page.waitForResponse(
        (res) =>
          res.url().includes("/transactions/") &&
          res.request().method() === "PATCH",
      );
      await this.acceptButton.click();
      await responsePromise;
    });
  }

  public async rejectRequest(): Promise<void> {
    await test.step("Reject transaction request", async () => {
      const responsePromise = this.page.waitForResponse(
        (res) =>
          res.url().includes("/transactions/") &&
          res.request().method() === "PATCH",
      );
      await this.rejectButton.click();
      await responsePromise;
    });
  }

  public async clickLike(): Promise<void> {
    await test.step("Click like button", async () => {
      const responsePromise = this.page.waitForResponse(
        (res) =>
          res.url().includes("/likes/") && res.request().method() === "POST",
      );
      await this.likeButton.click();
      await responsePromise;
    });
  }

  public async submitComment(text: string): Promise<void> {
    await test.step(`Submit a comment: ${text}`, async () => {
      const responsePromise = this.page.waitForResponse(
        (res) =>
          res.url().includes("/comments/") && res.request().method() === "POST",
      );
      await this.commentInput.fill(text);
      await this.commentInput.press("Enter");
      await responsePromise;
    });
  }
}
