import { APIRequestContext, test as base } from "@playwright/test";
import { ApiClient } from "@src/api/clients/api.client";
import { AppManager } from "@src/ui/pages/app.manager";

type MyFixtures = {
  app: AppManager;
  apiClient: ApiClient;
};

export const test = base.extend<MyFixtures>({
  app: async ({ page }, use) => {
    await use(new AppManager(page));
  },
  apiClient: async (
    { request }: { request: APIRequestContext },
    use: (r: ApiClient) => Promise<void>,
  ) => {
    await use(new ApiClient(request));
  },
});

export { expect } from "@playwright/test";
