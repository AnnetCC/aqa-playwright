import {test, expect} from '@playwright/test';
import WelcomePage from "../src/pageObjects/welcomePage/WelcomePage.js";
import RandomCreator from "../src/utils/RandomCreator.js";
import UserController from "../src/pageObjects/controllers/UserController.js";
import * as expectedErrors from './pom/fixtures/register.fixtures.js'

test.describe('Test register new user form', () => {

    let welcomePage;
    let signUp;
    const email = RandomCreator.generateEmail();
    const password = RandomCreator.generatePassword();
    const registerData = {
        signupName: 'Anna',
        signupLastName: 'Hritskova',
        signupEmail: email,
        signupPassword: password,
        signupRepeatPassword: password
    };

    test.beforeEach(async ({page}) => {
        welcomePage = new WelcomePage(page);
        await welcomePage.open();
        await welcomePage.waitLoaded();
        signUp = await welcomePage.openSignUpPopup();
    });

    test('Verify that new user can be signed up', async ({page}) => {
        await signUp.registerNewUser(registerData);
    });

    test('Verify that the same user cannot be signed up', async () => {
        await signUp.verifyExistentUser(registerData);
    });

    test('Verify that fields cannot be empty', async () => {
        await signUp.fillInvalidData(registerData, {
            signupName: '',
            signupLastName: '',
            signupEmail: '',
            signupPassword: '',
            signupRepeatPassword: ''
        }, expectedErrors.EMPTY_FIELDS_ERRORS);
    });

    test('Verify that error messages are returned if name and last name data are invalid', async () => {
        for (const value of ['a1nna', '123', 'a ns d', 'Anna@', 'Ірина']) {
            await signUp.fillInvalidData(registerData, {
                signupName: value,
                signupLastName: value
            }, expectedErrors.INVALID_NAMES_ERRORS);
        }
    });

    test('Verify that error messages are returned if name and last name have incorrect length', async () => {
        for (const value of ['a', 'annahritskovaromanovna']) {
            await signUp.fillInvalidData(registerData, {
                signupName: value,
                signupLastName: value
            }, expectedErrors.INVALID_NAMES_LENGTH_ERRORS);
        }
    });

    test('Verify that error message is returned if email input is invalid', async () => {
        for (const value of ['aqa-ksk', 'Anna@', 'a12', 'mysuperpuperemailadress.com', 'aqa adnaced@gmail.com']) {
            await signUp.fillInvalidData(registerData, {
                signupEmail: value
            }, expectedErrors.INVALID_EMAIL_ERRORS);
        }
    });

    test('Verify that error messages is returned if password field has invalid value', async () => {
        for (const value of ['a1', '123', 'welcomeguys', 'Welcomeguys12345@@..23', 'Welcom1', '@welcome12', '..33']) {
            await signUp.fillInvalidData(registerData, {
                signupPassword: value,
                signupRepeatPassword: value
            }, expectedErrors.INVALID_PASSWORDS_ERRORS);
        }
    });

    test('Verify that error messages is returned if password field does not not match repeat password field', async () => {
        await signUp.fillInvalidData(registerData, {
            signupRepeatPassword: 'MondayM07@12'
        }, expectedErrors.PASSWORD_MATCH_ERRORS);
    });

    test.afterAll(async ({request}) => {
        const userController = new UserController(request, registerData.signupEmail, registerData.signupPassword);
        await userController.deleteUser();
    });
});
