import { test } from "../../src/fixtures/test.fixtures.js"

test("should remove all cars of current user @T21437189", async ({ userAPIClient }) => {
  const response = await userAPIClient.get("/api/cars")
  const body = await response.json()

  const carIds = body.data.map((car) => car.id)

  for (const id of carIds) {
    await userAPIClient.delete(`/api/cars/${id}`)
  }
})
