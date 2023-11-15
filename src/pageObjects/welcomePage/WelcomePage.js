import BasePage from "../BasePage.js";
import SignUpForm from "../components/SignUpForm.js";
import SignInForm from "../components/SignInForm.js";

export default class WelcomePage extends BasePage {
  _signUpButton = ".hero-descriptor_btn";
  _signInButton = ".header_signin";

  constructor(page) {
    super(page, "/", page.locator("button", {hasText: "Guest log in"}));
    this.signUpButton = this._page.locator(this._signUpButton, {hasText: "Sign up"});
    this.signInButton = this._page.locator(this._signInButton, {hasText: "Sign in"});
  }

  async openSignUpPopup() {
    await this.signUpButton.click();
    return new SignUpForm(this._page);
  }

  async openSignInPopup() {
    await this.signInButton.click();
    return new SignInForm(this._page);
  }
}
