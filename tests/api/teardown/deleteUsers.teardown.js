import APIClient from "../../../src/client/APIClient.js"
import { API_USERS } from "../../../src/data/users.js"
import { test } from "@playwright/test"

for (const user of Object.keys(API_USERS)) {
  test(`Delete user ${API_USERS[user].name} ${API_USERS[user].lastName} @Tf23dcf02`, async () => {
    const client = await APIClient.authenticate(undefined, {
      email: API_USERS[user].email,
      password: API_USERS[user].password
    })
    await client.user.deleteCurrentUser()
  })
}
