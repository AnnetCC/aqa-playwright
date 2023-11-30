import {expect, test} from "@playwright/test"
import WelcomePage from "../src/pageObjects/welcomePage/WelcomePage.js"
import RandomCreator from "../src/utils/RandomCreator.js"
import * as expectedErrors from "./pom/fixtures/register.fixtures.js"
import {USERS} from "../src/data/users.js"
import APIClient from "../src/client/APIClient.js"

test.describe("Test register new user form @regression @smoke @S807c2d82", () => {
  let welcomePage
  let signUp
  const email = RandomCreator.generateEmail()
  const password = RandomCreator.generatePassword()
  const registerData = {
    signupName: "Anna",
    signupLastName: "Hritskova",
    signupEmail: email,
    signupPassword: password,
    signupRepeatPassword: password
  }

  test.beforeEach(async ({page}) => {
    welcomePage = new WelcomePage(page)

    await welcomePage.open()
    await welcomePage.waitLoaded()
    signUp = await welcomePage.openSignUpPopup()
  })

  test("Verify that new user can be signed up @T84dc047c", async ({page}) => {
    await signUp.registerNewUser(registerData)
  })

  test("Verify that the same user cannot be signed up @T57ecf2ba", async () => {
    const data = {
      ...registerData,
      signupEmail: USERS.ANNA_HRITSKOVA.email
    }

    await signUp.fill(data)
    await signUp.registerButton.click()
    await expect(signUp.alertDanger).toBeVisible()
  })

  test("Verify that fields cannot be empty @Td2e351df", async () => {
    const data = {
      ...registerData,
      signupName: "",
      signupLastName: "",
      signupEmail: "",
      signupPassword: "",
      signupRepeatPassword: ""
    }

    await signUp.fill(data)
    await signUp.validateErrors(Object.keys(data), expectedErrors.EMPTY_FIELDS_ERRORS)
  })

  test("Verify that error messages are returned if name and last name data are invalid @T98907a02", async () => {
    for (const value of ["a1nna", "123", "a ns d", "Anna@", "Ірина"]) {
      const data = {
        ...registerData,
        signupName: value,
        signupLastName: value
      }

      await signUp.fill(data)
      await signUp.validateErrors(["signupName", "signupLastName"], expectedErrors.INVALID_NAMES_ERRORS)
    }
  })

  test("Verify that error messages are returned if name and last name have incorrect length @Tc942b375", async () => {
    for (const value of ["a", "annahritskovaromanovna"]) {
      const data = {
        ...registerData,
        signupName: value,
        signupLastName: value
      }

      await signUp.fill(data)
      await signUp.validateErrors(["signupName", "signupLastName"], expectedErrors.INVALID_NAMES_LENGTH_ERRORS)
    }
  })

  test("Verify that error message is returned if email input is invalid @T402729ee", async () => {
    for (const value of ["aqa-ksk", "Anna@", "a12", "mysuperpuperemailadress.com", "aqa adnaced@gmail.com"]) {
      const data = {
        ...registerData,
        signupEmail: value
      }

      await signUp.fill(data)
      await signUp.validateErrors(["signupEmail"], expectedErrors.INVALID_EMAIL_ERRORS)
    }
  })

  test("Verify that error messages is returned if password field has invalid value @Ta7a3ab1f", async () => {
    for (const value of ["a1", "123", "welcomeguys", "Welcomeguys12345@@..23", "Welcom1", "@welcome12", "..33"]) {
      const data = {
        ...registerData,
        signupPassword: value,
        signupRepeatPassword: value
      }

      await signUp.fill(data)
      await signUp.validateErrors(["signupPassword", "signupRepeatPassword"], expectedErrors.INVALID_PASSWORDS_ERRORS)
    }
  })

  test("Verify that error messages is returned if password field does not not match repeat password field @T9fcfa220", async () => {
    const data = {
      ...registerData,
      signupRepeatPassword: "MondayM07@12"
    }

    await signUp.fill(data)
    await signUp.validateErrors(["signupRepeatPassword"], expectedErrors.PASSWORD_MATCH_ERRORS)
  })

  test.afterAll(async () => {
    const client = await APIClient.authenticate(undefined, {
      email: registerData.signupEmail,
      password: registerData.signupPassword,
      remember: false
    })

    await client.user.deleteCurrentUser()
  })
})
