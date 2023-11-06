import BasePage from "../BasePage.js";
import SignUpForm from "../components/SignUpForm.js";

export default class WelcomePage extends BasePage {

    _signUpButton = '.hero-descriptor_btn'

    constructor(page) {
        super(page, '/', page.locator('button', {hasText: 'Guest log in'}));
        this.signUpButton = this._page.locator(this._signUpButton, {hasText: 'Sign up'});
    }

    async openSignUpPopup() {
        await this.signUpButton.click();
        return new SignUpForm(this._page);
    }
}
