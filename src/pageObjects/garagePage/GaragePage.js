import BasePage from "../BasePage.js"

export default class GaragePage extends BasePage {
  _label = "h1"
  _fuelExpensesButton = ".sidebar_btn"

  constructor (page) {
    super(page, "/panel/garage", page.locator("#userNavDropdown", { hasText: "My Profile" }))
    this.garageLabel = this._page.locator(this._label, { hasText: "Garage" })
    this.expensesLabel = this._page.locator(this._label, { hasText: "Fuel Expenses" })
    this.fuelExpensesButton = this._page.locator(this._fuelExpensesButton, { hasText: "Fuel Expenses" })
  }
}
