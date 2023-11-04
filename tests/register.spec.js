import {test, expect} from '@playwright/test';
import {clickSignUpButton, fillInvalidData, fillRegisterForm, randomEmail, randomPassword} from '../src/utils.js';

const email = randomEmail();
const password = randomPassword();
const registerData = {
    signupName: 'Anna',
    signupLastName: 'Hritskova',
    signupEmail: email,
    signupPassword: password,
    signupRepeatPassword: password
};

test.describe('Test register new user form', () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/');
    })

    test('Verify that new user can be signed up', async ({page, request}) => {
        await clickSignUpButton(page);
        await fillRegisterForm(page, registerData);

        await expect(page.locator('div.user-nav button[id="userNavDropdown"]'))
            .toHaveText('My profile');
    });

    test('Verify that the same user cannot be signed up', async ({page, request}) => {
        await clickSignUpButton(page);
        await fillRegisterForm(page, registerData);

        await expect(page.locator('p.alert-danger'))
            .toHaveText('User already exists');
    });

    test('Verify that fields cannot be empty', async ({page}) => {
        await clickSignUpButton(page);
        const errors = await fillInvalidData(page, registerData, {
            signupName: '',
            signupLastName: '',
            signupEmail: '',
            signupPassword: '',
            signupRepeatPassword: ''
        });

        await expect(errors, 'should return error message with empty input data')
            .toEqual([
                'Name required',
                'Last name required',
                'Email required',
                'Password required',
                'Re-enter password required'
            ]);
    });

    test('Verify that error messages are returned if name and last name data are invalid', async ({page}) => {
        await clickSignUpButton(page);
        for (const value of ['a1nna', '123', 'a ns d', 'Anna@', 'Ірина']) {
            const errors = await fillInvalidData(page, registerData, {
                signupName: value,
                signupLastName: value
            });

            await expect(errors, 'should return error message with invalid name and last name')
                .toEqual(['Name is invalid', 'Last name is invalid']);
        }
    });

    test('Verify that error messages are returned if name and last name have incorrect length', async ({page}) => {
        await clickSignUpButton(page);
        for (const value of ['a', 'annahritskovaromanovna']) {
            const errors = await fillInvalidData(page, registerData, {
                signupName: value,
                signupLastName: value
            });

            await expect(errors, 'should return error message with incorrect length of name and last name')
                .toEqual([
                    'Name has to be from 2 to 20 characters long',
                    'Last name has to be from 2 to 20 characters long']);
        }
    });

    test('Verify that error message is returned if email input is invalid', async ({page}) => {
        await clickSignUpButton(page);
        for (const value of ['aqa-ksk', 'Anna@', 'a12', 'mysuperpuperemailadress.com', 'aqa adnaced@gmail.com']) {
            const errors = await fillInvalidData(page, registerData, {
                signupEmail: value
            });

            await expect(errors, 'should return error message with invalid email')
                .toEqual(['Email is incorrect']);
        }
    });

    test('Verify that error messages is returned if password field has invalid value', async ({page}) => {
        await clickSignUpButton(page);
        for (const value of ['a1', '123', 'welcomeguys', 'Welcomeguys12345@@..23', 'Welcom1', '@welcome12', '..33']) {
            const errors = await fillInvalidData(page, registerData, {
                signupPassword: value,
                signupRepeatPassword: value
            });

            await expect(errors, 'should return error message with invalid password fields')
                .toEqual([
                    'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter',
                    'Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter']);
        }
    });

    test('Verify that error messages is returned if password field does not not match repeat password field', async ({page}) => {
        await clickSignUpButton(page);
        const errors = await fillInvalidData(page, registerData, {
            signupRepeatPassword: 'MondayM07@12'
        });

        await expect(errors, 'should return error message if passwords do not match')
            .toEqual(['Passwords do not match']);
    });

    test.afterAll(async ({request}) => {
        const auth = await request.post('/api/auth/signin',
            {
                data:
                    {
                        email: registerData.signupEmail,
                        password: registerData.signupPassword,
                        remember: false
                    }
            });
        const userId = (await auth.json()).data.userId;

        const deleteUser = await request.delete(`/api/users`, {
            data:
                {userId: userId}
        });
        expect(deleteUser.status()).toBe(200);
    })
});


