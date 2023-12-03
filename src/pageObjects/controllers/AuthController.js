import BaseController from "./BaseController.js"

export default class AuthController extends BaseController {
  #SIGN_IN_PATH = "/auth/signin"
  #SIGN_UP_PATH = "/auth/signup"

  constructor (options) {
    super(options)
  }

  async signUp (userData) {
    return await this._client.post(this.#SIGN_UP_PATH, userData)
  }

  async signIn ({ email, password, remember = false }) {
    return await this._client.post(this.#SIGN_IN_PATH, {
      email,
      password,
      remember
    })
  }
}
