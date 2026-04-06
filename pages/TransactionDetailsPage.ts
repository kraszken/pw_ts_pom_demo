import { Locator, Page, test } from "@playwright/test";

export class TransactionDetailsPage {
  public readonly detailHeader: Locator;
  public readonly acceptButton: Locator;
  public readonly rejectButton: Locator;
  public readonly likeButton: Locator;
  public readonly likeCount: Locator;
  public readonly commentsList: Locator;

  private readonly commentInput: Locator;

  constructor(public readonly page: Page) {
    this.detailHeader = page.getByTestId("transaction-detail-header");
    this.acceptButton = page.locator(
      '[data-test^="transaction-accept-request"]',
    );
    this.rejectButton = page.locator(
      '[data-test^="transaction-reject-request"]',
    );
    this.likeButton = page.locator('[data-test^="transaction-like-button"]');
    this.likeCount = page.locator('[data-test^="transaction-like-count"]');
    this.commentInput = page.locator(
      '[data-test^="transaction-comment-input"]',
    );
    this.commentsList = page.getByTestId("comments-list");
  }

  public async acceptRequest(): Promise<void> {
    await test.step("Accept transaction request", async () => {
      const responsePromise = this.page.waitForResponse(
        (r) =>
          r.url().includes("/transactions/") &&
          r.request().method() === "PATCH",
      );
      await this.acceptButton.click();
      await responsePromise;
    });
  }

  public async rejectRequest(): Promise<void> {
    await test.step("Reject transaction request", async () => {
      const responsePromise = this.page.waitForResponse(
        (r) =>
          r.url().includes("/transactions/") &&
          r.request().method() === "PATCH",
      );
      await this.rejectButton.click();
      await responsePromise;
    });
  }

  public async clickLike(): Promise<void> {
    await test.step("Click like button", async () => {
      const responsePromise = this.page.waitForResponse(
        (r) => r.url().includes("/likes/") && r.request().method() === "POST",
      );
      await this.likeButton.click();
      await responsePromise;
    });
  }

  public async submitComment(text: string): Promise<void> {
    await test.step(`Submit a comment: ${text}`, async () => {
      const responsePromise = this.page.waitForResponse(
        (r) =>
          r.url().includes("/comments/") && r.request().method() === "POST",
      );
      await this.commentInput.fill(text);
      await this.commentInput.press("Enter");
      await responsePromise;
    });
  }
}
