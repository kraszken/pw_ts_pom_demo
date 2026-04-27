import fs from "node:fs";
import path from "node:path";

/**
 * Funkcja czyszcząca dane autoryzacyjne po zakończeniu runów Playwrighta.
 */
async function globalTeardown() {
  console.log("🧹 Global Teardown: Cleaning up data after tests...");
  const authDir = path.join(process.cwd(), ".auth");

  if (fs.existsSync(authDir)) {
    fs.rmSync(authDir, { recursive: true, force: true });
    console.log("✅ Global Teardown: .auth directory removed.");
  }
}

export default globalTeardown;
