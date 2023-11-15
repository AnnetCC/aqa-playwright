import { test } from "@playwright/test"
import { testConfig } from "../../config/testConfig.js"
import { USERS } from "../../src/data/users.js"

async function createUser (data) {
  const response = await fetch(`${testConfig.baseURL}/api/auth/signup`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
  return response
}

test("Create user @T4306043f", async () => {
  const res = await createUser(USERS.ANNA_HRITSKOVA)
  const body = await res.json()
})
