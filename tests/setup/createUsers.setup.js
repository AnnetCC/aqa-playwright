import { test } from "@playwright/test"
import { USERS } from "../../src/data/users.js"
import AuthController from "../../src/pageObjects/controllers/AuthController.js"

test("Create user Anna Hritskova @T4306043f", async () => {
  const authController = new AuthController()
  const response = await authController.signUp(USERS.ANNA_HRITSKOVA)
})
