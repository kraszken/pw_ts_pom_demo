import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const ENV = {
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  API_URL: process.env.API_URL || "http://localhost:3001",
  USER_PASSWORD: process.env.USERPASSWORD || "s3cret",
  CI: !!process.env.CI,
} as const;
