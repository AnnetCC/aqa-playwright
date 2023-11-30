import { test } from "@playwright/test"
import AuthController from "../../../src/pageObjects/controllers/AuthController.js"
import { API_USERS } from "../../../src/data/users.js"

for (const user of Object.keys(API_USERS)) {
  test(`Create user ${API_USERS[user].name} ${API_USERS[user].lastName} @T80df8c4e`, async () => {
    const authController = new AuthController()
    const response = await authController.signUp(API_USERS[user])
  })
}
