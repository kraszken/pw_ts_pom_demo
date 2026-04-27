import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./config/env.config";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: ENV.CI,
  retries: ENV.CI ? 2 : 0,
  workers: ENV.CI ? 1 : undefined,
  reporter: "html",
  timeout: 15 * 1000,
  expect: { timeout: 4 * 1000 },
  use: {
    baseURL: ENV.BASE_URL,
    trace: "retain-on-failure",
    testIdAttribute: "data-test",
  },
  projects: [
    {
      name: "setup",
      testMatch: "**/tests/setup/**/*.setup.ts",
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: ["--window-size=1920,1080"],
        },
      },
    },
    {
      name: "api",
      testMatch: "**/tests/api/**/*.spec.ts",
      use: {
        baseURL: ENV.API_URL,
      },
    },
  ],
});
