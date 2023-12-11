// @ts-check
import {defineConfig, devices, test} from "@playwright/test"
import {testConfig} from "./config/testConfig.js"
/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Run tests in files in parallel */
  testMatch: "tests/**/*.spec.js",
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  outputDir: "./test-output",
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  maxFailures: 10,
  /* Opt out of parallel tests on CI. */
  workers: 2,
  timeout: 30000,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html", {open: "never"}],
    [process.env.CI ? "github" : "list"],
    [
      "@testomatio/reporter/lib/adapter/playwright.js",
      {
        apiKey: testConfig.reporters.testomat.key
      }
    ]
  ],
  // ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: true,
    httpCredentials: testConfig.httpCredentials,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: testConfig.baseURL,
    viewport: {
      width: 1200,
      height: 840
    },
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry"
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: "**/setup/**/*.setup.js",
      testIgnore: "**/api/**/setup/**/*.setup.js"
    },
    {
      name: "setup-api",
      testMatch: "**/api/**/setup/**/*.setup.js"
    },
    {
      name: "api",
      testMatch: "**/api/**/*.spec.js",
      dependencies: ["setup-api"],
      teardown: "teardown-api"
    },
    {
      name: "teardown-api",
      testMatch: "**/api/**/teardown/**/*.teardown.js"
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        screenshot: {
          mode: "only-on-failure",
          fullPage: true
        }
      },
      dependencies: ["setup"],
      testIgnore: "tests/api/**/*.spec.js"
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        screenshot: {
          mode: "only-on-failure",
          fullPage: true
        }
      },
      dependencies: ["setup"],
      testIgnore: "tests/api/**/*.spec.js"
    }
    // {
    //     name: 'webkit',
    //     use: {
    //         ...devices['Desktop Safari'],
    //         screenshot: {
    //             'mode': 'only-on-failure',
    //             fullPage: true
    //         }
    //     },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
