import {expect} from "@playwright/test";

export async function fillRegisterForm(page, options, isNegative) {
    const registerButton = page.locator('div.modal-footer button');

    for (const key of Object.keys(options)) {
        const field = page.locator(`input[id='${key}']`);
        await field.fill(options[key]);
        await page.keyboard.press('Tab');
    }

    if (isNegative) {
        await expect(registerButton, 'Register button should be disabled').toBeDisabled();
        return;
    }

    await expect(registerButton, 'Register button should be enabled').toBeEnabled();
    await registerButton.click();
}

export async function clickSignUpButton(page) {
    const signUpButton = page.locator('button.hero-descriptor_btn');
    await expect(signUpButton).toBeEnabled();

    await signUpButton.click();
    const registerForm = page.locator('div.modal-content');
    await expect(registerForm).toBeVisible();
}

export async function fillInvalidData(page, sourceData, options) {
    let newRegisterData = Object.assign({}, sourceData);
    let fields = [];
    let actualErrors = [];
    const popup = page.locator('div.modal-dialog');

    for (const key of Object.keys(options)) {
        newRegisterData[key] = options[key];
        fields.push(page.locator(`input[id='${key}']`));
    }

    await fillRegisterForm(page, newRegisterData, true);
    for (const field of fields) {
        await expect(field, 'error message should be bordered with red color').toHaveCSS('border-color', 'rgb(220, 53, 69)');
    }

    let errors = await popup.locator(`div.invalid-feedback`);
    for (let i = 0; i < await errors.count(); i++) {
        actualErrors.push(await errors.nth(i).innerText());
    }
    return actualErrors;
}
