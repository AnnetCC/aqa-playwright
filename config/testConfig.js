import dotenv from "dotenv"

dotenv.config()

export const testConfig = {
  baseURL: process.env.BASE_URL,
  httpCredentials: {
    username: process.env.HTTP_CREDENTIAL_USER_NAME,
    password: process.env.HTTP_CREDENTIAL_PASSWORD
  },
  reporters: {
    testomat: {
      key: process.env.TESTOMAT_KEY
    }
  }
}
