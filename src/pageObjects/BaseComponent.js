export default class BaseComponent {
    constructor(page, container) {
        this._page = page
        this._container = container
    }

    async waitLoaded() {
        await this._container.waitFor()
    }
}
