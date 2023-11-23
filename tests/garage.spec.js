import { expect } from "@playwright/test"
import { test } from "../src/fixtures/test.fixtures.js"

test.describe("Test garage page @Sadb7a718", () => {
  test("Verify that label Garage exists @T732cfb5c", async ({ userGaragePage }) => {
    await expect(userGaragePage.garageLabel).toBeVisible()
  })

  test("Verify that Fuel expenses tab can be opened from garage page @Tf35eae83", async ({ userGaragePage }) => {
    await userGaragePage.fuelExpensesButton.click()
    await expect(userGaragePage.expensesLabel, "Fuel expenses tab is opened").toBeVisible()
  })
})
