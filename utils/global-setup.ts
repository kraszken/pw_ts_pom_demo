import { chromium, FullConfig, request, selectors } from "@playwright/test";
import fs from "fs";
import path from "path";
import { env } from "process";
import { ApiClient } from "./api-client";

async function globalSetup(config: FullConfig) {
  selectors.setTestIdAttribute("data-test");

  const authDir = path.join(process.cwd(), ".auth");

  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir);
  }

  const baseURL = config.projects[0]?.use?.baseURL || "http://localhost:3000";

  const requestContext = await request.newContext();
  const apiClient = new ApiClient(requestContext);
  const password = env.USERPASSWORD || "s3cret";

  try {
    const browser = await chromium.launch();

    async function authenticateAndSave(username: string, fileName: string) {
      const context = await browser.newContext({ baseURL });
      const page = await context.newPage();

      await page.goto("/signin");
      await page.getByRole("textbox", { name: "Username" }).fill(username);
      await page.getByRole("textbox", { name: "Password" }).fill(password);

      await page.getByTestId("signin-submit").click();
      await page.getByTestId("sidenav-username").waitFor();

      const onboardingDialog = page.getByTestId("user-onboarding-dialog");
      if (await onboardingDialog.isVisible()) {
        await page.getByTestId("user-onboarding-next").click();
        await page
          .getByRole("textbox", { name: "Bank Name" })
          .fill("Global Setup Bank");
        await page
          .getByRole("textbox", { name: "Routing Number" })
          .fill("123456789");
        await page
          .getByRole("textbox", { name: "Account Number" })
          .fill("1234567890");
        await page.getByTestId("bankaccount-submit").click();
        await page.getByTestId("user-onboarding-next").click();
        await onboardingDialog.waitFor({ state: "hidden" });
      }

      await context.storageState({ path: path.join(authDir, fileName) });
      await context.close();
    }

    console.log("🌍 Global Setup: Generating fresh test sessions...");

    const sender = await apiClient.createUniqueUser("Sender");
    await authenticateAndSave(sender.username, "sender.json");

    const receiver = await apiClient.createUniqueUser("Receiver");
    await authenticateAndSave(receiver.username, "receiver.json");

    await browser.close();
    await requestContext.dispose();

    console.log("✅ Global Setup: Sessions ready.");
  } catch (error: any) {
    throw new Error(`
    ❌ CRITICAL GLOBAL SETUP ERROR: Cannot connect to the application at ${baseURL}!
    Details: ${error.message}
    
    👉 VERIFY: Is the application server running in a separate terminal?
    `);
  }
}

export default globalSetup;
