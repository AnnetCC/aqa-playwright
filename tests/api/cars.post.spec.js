import {test} from "../../src/fixtures/test.fixtures.js"
import {API_USERS} from "../../src/data/users.js"
import {VALID_BRANDS_RESPONSE_BODY} from "../../src/data/brands.js"
import {VALID_BRAND_MODELS} from "../../src/data/models.js"
import {expect} from "@playwright/test"
import {VALID_POST_CARS_RESPONSE_BODY} from "./fixtures/responseCars.js"
import APIClient from "../../src/client/APIClient.js"

test.describe("Test POST request @S0b88de95", () => {
  let client
  let clientNotAuthorized

  const brandId = VALID_BRANDS_RESPONSE_BODY.data[2].id
  const modelId = VALID_BRAND_MODELS[brandId].data[3].id
  const requestBody = {
    carBrandId: brandId,
    carModelId: modelId,
    mileage: 100
  }

  test.beforeAll(async () => {
    client = await APIClient.authenticate(undefined, {
      email: API_USERS.TARAS_SHEVCHENKO.email,
      password: API_USERS.TARAS_SHEVCHENKO.password
    })
    clientNotAuthorized = new APIClient()
  })

  test("should create new car @Ta7809b60", async () => {
    const response = await client.cars.addCar(requestBody)

    await expect(response.status, "Status code should be 201").toEqual(201)
    await expect(response.data, "Valid brands should be returned").toEqual(VALID_POST_CARS_RESPONSE_BODY)
  })

  test("should return error message if model not found @T1c303cea", async () => {
    const response = await client.cars.addCar({...requestBody, carModelId: 133})

    await expect(response.status, "Status code should be 404").toEqual(404)
    await expect(response.data.message, "should throw error message").toEqual("Model not found")
  })

  test("should throw error message with non authorized car @Tdb0f9a11", async () => {
    const response = await clientNotAuthorized.cars.addCar(requestBody)

    await expect(response.status, "Status code should be 401").toEqual(401)
    await expect(response.data.message, "Error message should be returned").toEqual("Not authenticated")
  })

  test("should return error message with invalid car brand type @T536d915f", async () => {
    const response = await client.cars.addCar({...requestBody, carBrandId: "non-existent"})

    await expect(response.status, "Status code should be 400").toEqual(400)
    await expect(response.data.message, "should throw error message").toEqual("Invalid car brand type")
  })

  test.afterAll(async () => {
    const response = await client.cars.getUserCars()
    for (const car of response.data.data) {
      await client.cars.deleteCar(car.id)
    }
  })
})
