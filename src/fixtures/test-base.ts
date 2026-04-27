import { APIRequestContext, test as base } from "@playwright/test";
import { ApiClient } from "@src/api/clients/api.client";
import { AppManager } from "@src/ui/pages/app.manager";

type MyFixtures = {
  app: AppManager;
  apiClient: ApiClient;
};

export const test = base.extend<MyFixtures>({
  app: async ({ page }, use) => {
    const frontendErrors: Error[] = [];

    page.on("pageerror", (error) => {
      console.error(`🚨 [Frontend JS Error Detected]: ${error.message}`);
      frontendErrors.push(error);
    });

    await use(new AppManager(page));

    if (frontendErrors.length > 0) {
      console.warn(
        `⚠️ Test passed, but accumulated ${frontendErrors.length} silent JavaScript errors in the browser. Check the traces.`,
      );
    }
  },

  apiClient: async (
    { request }: { request: APIRequestContext },
    use: (r: ApiClient) => Promise<void>,
  ) => {
    await use(new ApiClient(request));
  },
});

export { expect } from "@playwright/test";
