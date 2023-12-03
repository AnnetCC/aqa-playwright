import { CookieJar } from "tough-cookie"
import { wrapper } from "axios-cookiejar-support"
import axios from "axios"
import { testConfig } from "../../../config/testConfig.js"

export default class BaseController {
  constructor ({ baseUrl, cookies } = { baseUrl: testConfig.apiURL }) {
    this._baseUrl = baseUrl
    const jar = cookies ?? new CookieJar()
    this._client = wrapper(
      axios.create({
        baseURL: this._baseUrl,
        jar,
        validateStatus: (status) => {
          return status < 501
        }
      })
    )
  }
}
