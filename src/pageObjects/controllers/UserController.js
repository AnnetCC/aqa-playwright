import { expect } from "@playwright/test"

export default class UserController {
  constructor (request, email, password) {
    this._request = request
    this._email = email
    this._password = password
  }

  async #getUserId () {
    const auth = await this._request.post("/api/auth/signin", {
      data: {
        email: this._email,
        password: this._password,
        remember: false
      }
    })
    return (await auth.json()).data.userId
  }

  async deleteUser () {
    const userId = await this.#getUserId()
    const deleteUser = await this._request.delete("/api/users", {
      data: { userId }
    })
    await expect(deleteUser.status()).toBe(200)
  }
}
