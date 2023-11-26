import {test} from "../../src/fixtures/test.fixtures.js"
import {expect} from "@playwright/test"
import {CookieJar} from "tough-cookie"
import {wrapper} from "axios-cookiejar-support"
import {VALID_BRANDS_RESPONSE_BODY} from "../../src/data/brands.js"
import {VALID_BRAND_MODELS} from "../../src/data/models.js"
import axios from "axios"
import {testConfig} from "../../config/testConfig.js"
import {USERS} from "../../src/data/users.js"
import {VALID_CARS_RESPONSE_BODY} from "./fixtures/cars.js"

test.describe("Test API @Se941e07a", () => {
  let client

  test.beforeAll(async () => {
    const jar = new CookieJar()
    client = wrapper(
      axios.create({
        baseURL: testConfig.apiURL,
        jar,
        validateStatus: (status) => {
          return status < 501
        }
      })
    )

    await client.post("/auth/signin", {
      email: USERS.ANNA_HRITSKOVA.email,
      password: USERS.ANNA_HRITSKOVA.password,
      remember: false
    })
  })

  test("should create new car @Tb1112e80", async () => {
    const brandId = VALID_BRANDS_RESPONSE_BODY.data[2].id
    const modelId = VALID_BRAND_MODELS[brandId].data[3].id

    const requestBody = {
      carBrandId: brandId,
      carModelId: modelId,
      mileage: 100
    }

    const response = await client.post("/cars", requestBody)

    await expect(response.status, "Status code should be 201").toEqual(201)
    await expect(response.data, "Valid brands should be returned").toMatchObject(VALID_CARS_RESPONSE_BODY)
  })

  test("should return error message if model not found @Tba89db5f", async () => {
    const requestBody = {
      carBrandId: 1,
      carModelId: 13,
      mileage: 0
    }

    const response = await client.post("/cars", requestBody)

    await expect(response.status, "Status code should be 404").toEqual(404)
    await expect(response.data.message, "should throw error message").toEqual("Model not found")
  })

  test("should return error message with invalid car brand type @T645f9a9e", async () => {
    const requestBody = {
      carBrandId: "non-existent",
      carModelId: 1,
      mileage: 0
    }

    const response = await client.post("/cars", requestBody)

    await expect(response.status, "Status code should be 400").toEqual(400)
    await expect(response.data.message, "should throw error message").toEqual("Invalid car brand type")
  })
})
