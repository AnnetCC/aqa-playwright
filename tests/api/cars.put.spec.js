import { expect, test } from "@playwright/test"
import APIClient from "../../src/client/APIClient.js"
import { API_USERS } from "../../src/data/users.js"
import { VALID_PUT_CARS_RESPONSE_BODY } from "./fixtures/responseCars.js"
import { USER_CARS_REQUEST_BODY as userCars } from "./fixtures/requestCars.js"

test.describe("Test PUT request @S6d0e2eaf", () => {
  let client
  let client_not_authtorized
  let modifyData
  let carIds

  test.beforeAll(async () => {
    client = await APIClient.authenticate(undefined, {
      email: API_USERS.LESYA_UKRAINKA.email,
      password: API_USERS.LESYA_UKRAINKA.password
    })
    client_not_authtorized = await APIClient.authenticate(undefined, {
      email: "aqa-non-existent.com",
      password: "any97"
    })
    await client.cars.addCar(userCars[0])

    modifyData = {
      carBrandId: 4,
      carModelId: 18,
      mileage: 189
    }
    carIds = await client.cars.getUserCarsIds()
  })

  test("should modify car @Tde0b34dd", async () => {
    const response = await client.cars.modifyUserCar(carIds[0], modifyData)

    await expect(response.status, "Status code should be 200").toEqual(200)
    await expect(response.data, "Valid cars should be returned").toEqual(VALID_PUT_CARS_RESPONSE_BODY)
  })

  test("should throw error message with non authorized car @Ta727be4c", async () => {
    const response = await client_not_authtorized.cars.modifyUserCar(carIds[0], modifyData)

    await expect(response.status, "Status code should be 401").toEqual(401)
    await expect(response.data.message, "Error message should be returned").toEqual("Not authenticated")
  })

  test("should throw error message with invalid id @T6c20e098", async () => {
    const response = await client.cars.modifyUserCar(-100, modifyData)

    await expect(response.status, "Status code should be 404").toEqual(404)
    await expect(response.data.message, "Error message should be returned").toEqual("Car not found")
  })

  test("should throw error message with invalid response body @T0ba1f8be", async () => {
    const response = await client.cars.modifyUserCar(carIds[0], {
      carBrandId: "non-existent"
    })

    await expect(response.status, "Status code should be 400").toEqual(400)
    await expect(response.data.message, "Error message should be returned").toEqual("No valid fields to edit")
  })

  test.afterAll(async () => {
    const carIds = await client.cars.getUserCarsIds()
    for (const id of carIds) {
      await client.cars.deleteCar(id)
    }
  })
})
