import { FullConfig } from "@playwright/test";
import fs from "fs";
import path from "path";

async function globalTeardown(config: FullConfig) {
  console.log("🧹 Global Teardown: Cleaning up data after tests...");
  const authDir = path.join(process.cwd(), ".auth");

  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
    console.log("✅ Global Teardown: .auth directory removed.");
  }
}

export default globalTeardown;
