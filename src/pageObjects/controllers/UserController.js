import BaseController from "./BaseController.js"

export default class UserController extends BaseController {
  #DELETE_USER_PATH = "/users"

  constructor (options) {
    super(options)
  }

  async deleteCurrentUser () {
    return await this._client.delete(this.#DELETE_USER_PATH)
  }
}
