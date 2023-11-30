import AuthController from "../pageObjects/controllers/AuthController.js"
import { CookieJar } from "tough-cookie"
import CarController from "../pageObjects/controllers/CarController.js"
import { testConfig } from "../../config/testConfig.js"
import UserController from "../pageObjects/controllers/UserController.js"

export default class APIClient {
  constructor (options) {
    this.auth = new AuthController(options)
    this.cars = new CarController(options)
    this.user = new UserController(options)
  }

  static async authenticate (options = { baseUrl: testConfig.apiURL }, userData) {
    const jar = new CookieJar()
    const params = { ...options, cookies: jar }
    const authController = new AuthController(params)
    await authController.signIn(userData)
    return new APIClient(params)
  }
}
