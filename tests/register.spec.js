import {test, expect} from '@playwright/test';
import WelcomePage from "../src/pageObjects/welcomePage/WelcomePage.js";
import RandomCreator from "../src/utils/RandomCreator.js";
import UserController from "../src/pageObjects/controllers/UserController.js";
import * as expectedErrors from './pom/fixtures/register.fixtures.js'

const email = RandomCreator.generateEmail();
const password = RandomCreator.generatePassword();
const registerData = {
    signupName: 'Anna',
    signupLastName: 'Hritskova',
    signupEmail: email,
    signupPassword: password,
    signupRepeatPassword: password
};

test.describe('Test register new user form', () => {

    let welcomePage;
    let signUp;

    test.beforeEach(async ({page})=>{
        welcomePage = new WelcomePage(page)
        await welcomePage.open();
        await welcomePage.waitLoaded();
        signUp = await welcomePage.signUp(registerData);
    });

    test('Verify that new user can be signed up', async ({page}) => {
        await signUp.registerNewUser();
        await expect(page, 'user should be redirected to garage page').toHaveURL('/panel/garage');
    });

    test('Verify that the same user cannot be signed up', async () => {
        await signUp.registerNewUser();
        await expect(signUp.alertDanger).toBeVisible();
    });

    test('Verify that fields cannot be empty', async () => {
        const errors = await signUp.fillInvalidData({
            signupName: '',
            signupLastName: '',
            signupEmail: '',
            signupPassword: '',
            signupRepeatPassword: ''
        });

        await expect(errors, 'should return error message with empty input data')
            .toEqual(expectedErrors.EMPTY_FIELDS_ERRORS);
    });

    test('Verify that error messages are returned if name and last name data are invalid', async () => {
        for (const value of ['a1nna', '123', 'a ns d', 'Anna@', 'Ірина']) {
            const errors = await signUp.fillInvalidData({
                signupName: value,
                signupLastName: value
            });

            await expect(errors, 'should return error message with invalid name and last name')
                .toEqual(expectedErrors.INVALID_NAMES_ERRORS);
        }
    });

    test('Verify that error messages are returned if name and last name have incorrect length', async () => {
        for (const value of ['a', 'annahritskovaromanovna']) {
            const errors = await signUp.fillInvalidData({
                signupName: value,
                signupLastName: value
            });

            await expect(errors, 'should return error message with incorrect length of name and last name')
                .toEqual(expectedErrors.INVALID_NAMES_LENGTH_ERRORS);
        }
    });

    test('Verify that error message is returned if email input is invalid', async () => {
        for (const value of ['aqa-ksk', 'Anna@', 'a12', 'mysuperpuperemailadress.com', 'aqa adnaced@gmail.com']) {
            const errors = await signUp.fillInvalidData( {
                signupEmail: value
            });

            await expect(errors, 'should return error message with invalid email')
                .toEqual(expectedErrors.INVALID_EMAIL_ERRORS);
        }
    });

    test('Verify that error messages is returned if password field has invalid value', async () => {
        for (const value of ['a1', '123', 'welcomeguys', 'Welcomeguys12345@@..23', 'Welcom1', '@welcome12', '..33']) {
            const errors = await signUp.fillInvalidData({
                signupPassword: value,
                signupRepeatPassword: value
            });

            await expect(errors, 'should return error message with invalid password fields')
                .toEqual(expectedErrors.INVALID_PASSWORDS_ERRORS);
        }
    });

    test('Verify that error messages is returned if password field does not not match repeat password field', async () => {
        const errors= await signUp.fillInvalidData({
            signupRepeatPassword: 'MondayM07@12'
        });

        await expect(errors, 'should return error message if passwords do not match')
            .toEqual(expectedErrors.PASSWORD_MATCH_ERRORS);
    });
});

test.afterAll(async ({request}) => {
   const userController = new UserController(request, registerData.signupEmail, registerData.signupPassword);
   await userController.deleteUser();
})
