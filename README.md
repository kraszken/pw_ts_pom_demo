# 🎭 Playwright E2E Automation Framework

A professional, scalable, and fully stateless End-to-End (E2E) test automation framework built with **Playwright** and **TypeScript**. It implements strict **Page Object Model (POM)** encapsulation, custom fixtures, and dynamic test data generation via API to ensure reliable and parallel test execution.

This project is designed to test the [Cypress Real World App (RWA)](https://github.com/cypress-io/cypress-realworld-app) demonstration project.

---

## 🛠 Tech Stack

- **Engine:** [Playwright](https://playwright.dev/)
- **Language:** TypeScript
- **Design Pattern:** Page Object Model (POM) + Playwright Fixtures + App Manager
- **Data Generation:** [@faker-js/faker](https://fakerjs.dev/)
- **Environment Management:** [dotenv](https://github.com/motdotla/dotenv)

---

## 🚀 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (LTS version recommended, e.g., v18 or v20)
- **Yarn** (Strictly required to build and run the Cypress RWA application)
- **npm** (To manage dependencies for this Playwright framework)
- **Git**

---

## 📦 Step 1: Set Up the Target Application (Cypress RWA)

Our test suite runs against a local instance of the Cypress Real World App. You must clone and run the target application before executing any tests.

1. **Clone the target application repository:**

   ```bash
   git clone https://github.com/cypress-io/cypress-realworld-app.git
   cd cypress-realworld-app
   ```

2. **Install the application dependencies (Yarn is required):**

   ```bash
   yarn install
   ```

3. **Start the development server:**
   ```bash
   yarn dev
   ```

> **Important:** The application must remain running in the background. By default, the Frontend will be available at `http://localhost:3000` and the API backend at `http://localhost:3001`.

---

## ⚙️ Step 2: Framework Configuration

With the target application running, open a new terminal window to configure this Playwright repository.

1. **Clone this test repository and navigate into it:**

   ```bash
   git clone <YOUR_REPO_URL>
   cd pw_ts_pom_demo
   ```

2. **Install the project dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the project root and add the following keys:

   ```env
   USERPASSWORD=s3cret
   BASE_URL=http://localhost:3000
   API_URL=http://localhost:3001
   ```

4. **Install the required Playwright browsers:**
   ```bash
   npx playwright install --with-deps
   ```

---

## 🧪 Step 3: Running the Tests

This project is configured for fully parallel execution (`fullyParallel: true`). Below are the primary commands for running and debugging tests.

**Run all tests in headless mode (CI default):**

```bash
npx playwright test
```

**Run tests in UI Mode (Highly recommended for debugging & development):**

```bash
npx playwright test --ui
```

**Run a specific test file:**

```bash
npx playwright test tests/ui/e2e/01-login.spec.ts
```

**Run tests in headed mode (watch execution in the browser):**

```bash
npx playwright test --headed
```

**View the HTML test report & Trace Viewer:**

```bash
npx playwright show-report
```

---

## 📂 Project Structure

```text
pw_ts_pom_demo/
├── config/              # Environment & global configuration
├── src/
│   ├── api/             # API Clients, GraphQL queries & Models
│   ├── factories/       # Data generation logic (@faker-js/faker)
│   ├── fixtures/        # Playwright custom fixtures (test-base.ts)
│   ├── test-data/       # Static test data & validation error messages
│   └── ui/
│       ├── components/  # Reusable atomic UI components
│       └── pages/       # Page Object Models (POM) & AppManager
├── tests/
│   ├── api/             # API test specs
│   ├── setup/           # Global setup (Healthcheck) & teardown
│   └── ui/e2e/          # E2E test specs (*.spec.ts)
├── playwright.config.ts # Playwright framework configuration
└── tsconfig.json        # TypeScript compiler configuration
```

---

## 🏗 Architectural SDET Standards

This framework strictly adheres to Senior SDET best practices to eliminate test flakiness and ensure high maintainability:

**1. Stateless & Atomic Tests (Test Independence):**
Tests do not rely on pre-existing users or a shared state. The `ApiClient` dynamically seeds fresh, unique users and required backend states (like creating bank accounts via GraphQL or seeding transactions) in the `beforeEach` hooks. This guarantees that tests can run in absolute parallel without colliding.

**2. The App Manager Pattern:**
Individual spec files do not instantiate Page Objects directly. Instead, they use a centralized `AppManager` injected automatically via custom Playwright fixtures (`fixtures/test-base.ts`), drastically reducing boilerplate code.

**3. Strict POM Encapsulation:**

- **Private Actions:** UI interactable elements (inputs, buttons) are strictly typed as `private readonly` or wrapped in reusable components (e.g., `InputComponent`). Spec files cannot interact with the DOM directly.
- **Public Locators for Assertions:** Locators required for state verification are typed as `public readonly` to utilize Playwright's native web-first assertions (`expect(locator).toBeVisible()`).

**4. Business-Driven Workflows:**
The Page Object Models expose business-driven workflows (e.g., `updateProfile()`) grouped tightly under `test.step()` blocks for clean reporting and execution speed.

---

## 📊 Reporting and CI/CD Readiness

The framework utilizes Playwright's built-in `html` reporter. Upon a test failure in a CI/CD environment, Playwright will automatically generate a full **Trace Viewer** file. This allows you to time-travel through the failed test, inspect DOM snapshots, console logs, and network intercepts. Retries are natively configured for CI runs (`retries: ENV.CI ? 2 : 0`). Healthchecks are performed before suite execution to fail fast if the environment is down.
