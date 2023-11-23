export default class BaseComponent {
  constructor (page, container) {
    this._page = page
    this._container = container
  }

  get page () {
    return this._page
  }

  async waitLoaded () {
    await this._container.waitFor()
  }
}
