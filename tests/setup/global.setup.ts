import { ENV } from "@config/env.config";
import { test as setup } from "@playwright/test";

setup("Healthcheck API and Frontend", async ({ request }) => {
  console.log("🌍 Setup Project: Performing environment healthcheck...");

  const uiResponse = await request.get(ENV.BASE_URL);
  if (!uiResponse.ok()) {
    throw new Error(`UI healthcheck failed! Status: ${uiResponse.status()}`);
  }

  console.log("✅ Setup Project: Environment is healthy.");
});
