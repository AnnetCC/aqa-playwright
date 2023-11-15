import BaseComponent from "../BaseComponent.js"
import { expect } from "@playwright/test"

export default class SignInForm extends BaseComponent {
  _email = "#signinEmail"
  _password = "#signinPassword"
  _loginButton = ".modal-footer button"

  constructor (page) {
    super(page, page.locator("div.modal-content"))
    this.signinEmail = this._container.locator(this._email)
    this.signinPassword = this._container.locator(this._password)
    this.loginButton = this._container.locator(this._loginButton, { hasText: "Login" })
  }

  async fill (data) {
    await this.signinEmail.fill(data.email)
    await this.signinPassword.fill(data.password)
  }

  async signIn (data) {
    await this.fill(data)
    await expect(this.loginButton, "Login button should be enabled").toBeEnabled()
    await this.loginButton.click()
    await expect(this._page, "user should be redirected to garage page").toHaveURL("/panel/garage")
  }
}
