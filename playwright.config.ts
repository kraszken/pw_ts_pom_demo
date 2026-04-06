import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  globalSetup: path.resolve(__dirname, "./utils/global-setup.ts"),
  globalTeardown: path.resolve(__dirname, "./utils/global-teardown.ts"),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: 15 * 1000,
  expect: { timeout: 4 * 1000 },
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    viewport: { width: 1920, height: 1080 },
    testIdAttribute: "data-test",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: ".auth/sender.json",
      },
    },
  ],
});
