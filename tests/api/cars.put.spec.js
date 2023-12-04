import { expect, test } from "@playwright/test"
import APIClient from "../../src/client/APIClient.js"
import { API_USERS } from "../../src/data/users.js"
import { CAR_MODELS as userCars } from "./fixtures/requestCars.js"
import CreateCarModel from "../../src/models/cars/CreateCarModel.js"
import { VALID_BRANDS_RESPONSE_BODY } from "../../src/data/brands.js"
import { VALID_BRAND_MODELS } from "../../src/data/models.js"

test.describe("Test PUT request @S6d0e2eaf", () => {
  let client
  let clientNotAuthorized
  let cars
  let firstCar

  const brand = VALID_BRANDS_RESPONSE_BODY.data[4]
  const model = VALID_BRAND_MODELS[brand.id].data[2]
  const carModel = new CreateCarModel({
    carBrandId: brand.id,
    carModelId: model.id,
    mileage: 189
  })

  test.beforeAll(async () => {
    client = await APIClient.authenticate(undefined, {
      email: API_USERS.LESYA_UKRAINKA.email,
      password: API_USERS.LESYA_UKRAINKA.password
    })
    clientNotAuthorized = new APIClient()
    await client.cars.addCar(userCars[0])
    cars = await client.cars.getUserCars()
    firstCar = cars.data.data[0]
  })

  test("should modify car @Tde0b34dd", async () => {
    const response = await client.cars.modifyUserCar(firstCar.id, carModel)
    const expectedBody = {
      ...carModel,
      id: expect.any(Number),
      initialMileage: userCars[0].mileage,
      carCreatedAt: expect.any(String),
      updatedMileageAt: expect.any(String),
      brand: brand.title,
      model: model.title,
      logo: brand.logoFilename
    }

    await expect(response.status, "Status code should be 200").toEqual(200)
    await expect(response.data.data, "Valid cars should be returned").toEqual(expectedBody)
  })

  test("should throw error message with non authorized car @Ta727be4c", async () => {
    const response = await clientNotAuthorized.cars.modifyUserCar(firstCar.id, carModel)

    await expect(response.status, "Status code should be 401").toEqual(401)
    await expect(response.data.message, "Error message should be returned").toEqual("Not authenticated")
  })

  test("should throw error message with invalid id @T6c20e098", async () => {
    const response = await client.cars.modifyUserCar(-100, carModel)

    await expect(response.status, "Status code should be 404").toEqual(404)
    await expect(response.data.message, "Error message should be returned").toEqual("Car not found")
  })

  test("should throw error message with invalid response body @T0ba1f8be", async () => {
    const response = await client.cars.modifyUserCar(firstCar.id, {
      carBrandId: "non-existent"
    })

    await expect(response.status, "Status code should be 400").toEqual(400)
    await expect(response.data.message, "Error message should be returned").toEqual("No valid fields to edit")
  })

  test.afterAll(async () => {
    for (const car of cars.data.data) {
      await client.cars.deleteCar(car.id)
    }
  })
})
