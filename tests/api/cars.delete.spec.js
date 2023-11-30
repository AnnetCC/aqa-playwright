import { expect, test } from "@playwright/test"
import APIClient from "../../src/client/APIClient.js"
import { API_USERS } from "../../src/data/users.js"
import { USER_CARS_REQUEST_BODY as userCars } from "./fixtures/requestCars.js"

test.describe("Test DELETE request @S4a960b94", () => {
  let client
  let client_not_authtorized
  let carIds

  test.beforeAll(async () => {
    client = await APIClient.authenticate(undefined, {
      email: API_USERS.NESTOR_MAHNO.email,
      password: API_USERS.NESTOR_MAHNO.password
    })
    client_not_authtorized = await APIClient.authenticate(undefined, {
      email: "aqa-non-existent.com",
      password: "any97"
    })

    for (const userCar of userCars.slice(2)) {
      await client.cars.addCar(userCar)
    }

    carIds = await client.cars.getUserCarsIds()
  })

  test("should delete car by id @T0b49c3f3", async () => {
    const response = await client.cars.deleteCar(carIds[0])

    await expect(response.status, "Status code should be 200").toEqual(200)
    await expect(response.data, "should delete car").toEqual({ data: { carId: carIds[0] }, status: "ok" })
  })

  test("should throw error message if user not authorized @T8263bda6", async () => {
    const response = await client_not_authtorized.cars.deleteCar(carIds[1])

    await expect(response.status, "Status code should be 401").toEqual(401)
    await expect(response.data.message, "should throw error message").toEqual("Not authenticated")
  })

  test("should throw error message with invalid id @Tcfea2db4", async () => {
    const response = await client.cars.deleteCar(100)

    await expect(response.status, "Status code should be 404").toEqual(404)
    await expect(response.data.message, "should throw error message").toEqual("Car not found")
  })

  test.afterAll(async () => {
    const carIds = await client.cars.getUserCarsIds()
    for (const id of carIds) {
      await client.cars.deleteCar(id)
    }
  })
})
