import BaseComponent from "../BaseComponent.js";
import {expect} from "@playwright/test";

export default class SignUpForm extends BaseComponent {

    _inputName = '#signupName';
    _inputLastName = '#signupLastName';
    _inputEmail = '#signupEmail';
    _inputPassword = '#signupPassword';
    _inputRepeatPassword = '#signupRepeatPassword';
    _registerButton = '.modal-footer button';
    _alertDanger = '.alert-danger';
    _errors = '.invalid-feedback';

    constructor(page) {
        super(page, page.locator('div.modal-content'));
        this.signupName = this._container.locator(this._inputName);
        this.signupLastName = this._container.locator(this._inputLastName);
        this.signupEmail = this._container.locator(this._inputEmail);
        this.signupPassword = this._container.locator(this._inputPassword);
        this.signupRepeatPassword = this._container.locator(this._inputRepeatPassword);
        this.registerButton = this._container.locator(this._registerButton);
        this.alertDanger = this._container.locator(this._alertDanger, {hasText: 'User already exists'});
        this.errors = this._container.locator(this._errors);
    }

    async fill(data) {
        for (const key of Object.keys(data)) {
            await this[key].fill(data[key]);
            await this._page.keyboard.press('Tab');
        }
    }

    async #validateBorderColor(fields, color) {
        for (const field of fields) {
            await expect(this[field]).toHaveCSS('border-color', color);
        }
    }

    async validateErrors(fields, expectedErrors) {

        await this.#validateBorderColor(fields, 'rgb(220, 53, 69)');

        let actualErrors = [];
        for (let i = 0; i < await this.errors.count(); i++) {
            actualErrors.push(await this.errors.nth(i).innerText());
        }

        await expect(this.registerButton, 'Register button should be disabled').toBeDisabled();
        await expect(actualErrors).toEqual(expectedErrors);
    }

    async registerNewUser(data) {
        await this.fill(data);
        await expect(this.registerButton, 'Register button should be enabled').toBeEnabled();
        await this.registerButton.click();
        await expect(this._page, 'user should be redirected to garage page').toHaveURL('/panel/garage');
    }

    async verifyExistentUser(data) {
        await this.fill(data);
        await this.registerButton.click();
        await expect(this.alertDanger).toBeVisible();
    }
}
