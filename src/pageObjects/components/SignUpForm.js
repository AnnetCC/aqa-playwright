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

    constructor(page, inputValues) {
        super(page, page.locator('div.modal-content'));
        this.inputValues = inputValues;
        this.inputName = this._container.locator(this._inputName);
        this.inputLastName = this._container.locator(this._inputLastName);
        this.inputEmail = this._container.locator(this._inputEmail);
        this.inputPassword = this._container.locator(this._inputPassword);
        this.inputRepeatPassword = this._container.locator(this._inputRepeatPassword);
        this.registerButton = this._container.locator(this._registerButton);
        this.alertDanger = this._container.locator(this._alertDanger, {hasText: 'User already exists'});
        this.errors = this._container.locator(this._errors);
    }

    #inputs = () => {
        return {
            signupName: this.inputName,
            signupLastName: this.inputLastName,
            signupEmail: this.inputEmail,
            signupPassword: this.inputPassword,
            signupRepeatPassword: this.inputRepeatPassword
        }
    }

    async registerNewUser(isNegative = false, data = this.inputValues) {
        for (const key of Object.keys(data)) {
            await this.#inputs()[key].fill(data[key]);
            await this._page.keyboard.press('Tab');
        }

        if (isNegative) {
            await expect(this.registerButton, 'Register button should be disabled').toBeDisabled();
            return;
        }

        await expect(this.registerButton, 'Register button should be enabled').toBeEnabled();
        await this.registerButton.click();
    }

    async fillInvalidData(options) {
        let newRegisterData = Object.assign({}, this.inputValues);
        let redFields = [];
        let actualErrors = [];

        for (const key of Object.keys(options)) {
            newRegisterData[key] = options[key];
            redFields.push(this.#inputs()[key]);
        }

        await this.registerNewUser(true, newRegisterData);
        for (const field of redFields) {
            await expect(field, 'error message should be bordered with red color')
                .toHaveCSS('border-color', 'rgb(220, 53, 69)');
        }

        for (let i = 0; i < await this.errors.count(); i++) {
            actualErrors.push(await this.errors.nth(i).innerText());
        }
        return actualErrors;
    }
}
