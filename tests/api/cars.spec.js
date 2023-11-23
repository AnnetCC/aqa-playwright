import { test } from "../../src/fixtures/test.fixtures.js"
import { expect } from "@playwright/test"
import { VALID_BRANDS_RESPONSE_BODY } from "../../src/data/brands.js"
import { VALID_BRAND_MODELS } from "../../src/data/models.js"
test.describe("Test API @Se941e07a", () => {
  const apiURL = "/api/cars"

  test("should create new car @Tb1112e80", async ({ userAPIClient }) => {
    const brandId = VALID_BRANDS_RESPONSE_BODY.data[2].id
    const modelId = VALID_BRAND_MODELS[brandId].data[3].id

    const requestBody = {
      carBrandId: brandId,
      carModelId: modelId,
      mileage: 100
    }

    const response = await userAPIClient.post(apiURL, {
      data: requestBody
    })

    const body = await response.json()
    await expect(response, "Positive response should be returned").toBeOK()
    await expect(response.status(), "Status code should be 201").toEqual(201)
    await expect(body.status).toBe("ok")
    await expect(body.data, "Car should be created with data from request").toMatchObject(requestBody)
  })

  test("should return error message if model not found @Tba89db5f", async ({ userAPIClient }) => {
    const requestBody = {
      carBrandId: 1,
      carModelId: 13,
      mileage: 0
    }

    const response = await userAPIClient.post(apiURL, {
      data: requestBody
    })

    const body = await response.json()
    expect(response.status(), "Status code should be 404").toEqual(404)
    await expect(body.status).toBe("error")
    expect(body.message, "should throw error message").toEqual("Model not found")
  })

  test("should return error message with invalid car brand type @T645f9a9e", async ({ userAPIClient }) => {
    const requestBody = {
      carBrandId: "non-existent",
      carModelId: 1,
      mileage: 0
    }

    const response = await userAPIClient.post(apiURL, {
      data: requestBody
    })

    const body = await response.json()
    expect(response.status(), "Status code should be 400").toEqual(400)
    await expect(body.status).toBe("error")
    expect(body.message, "should throw error message").toEqual("Invalid car brand type")
  })
})
