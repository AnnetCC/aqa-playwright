import BaseController from "./BaseController.js"

export default class CarController extends BaseController {
  #CREATE_CAR_PATH = "/cars"
  #GET_USER_CARS_PATH = "/cars"
  #GET_USER_CARS_PATH_BY_ID = "/cars/#"
  #DELETE_USER_CARS_PATH = "/cars/#"
  #GET_BRANDS_PATH = "/cars/brands"
  #GET_MODELS_PATH = "/cars/models"
  #GET_BRANDS_BY_ID_CARS_PATH = "/cars/brands/#"
  #GET_MODELS_BY_ID_CARS_PATH = "/cars/models/#"

  constructor(options) {
    super(options)
  }

  async getUserCars() {
    return await this._client.get(this.#GET_USER_CARS_PATH)
  }

  async getBrands() {
    return await this._client.get(this.#GET_BRANDS_PATH)
  }

  async getBrandById(id) {
    return await this._client.get(this.#GET_BRANDS_BY_ID_CARS_PATH.replace("#", id))
  }

  async getModels() {
    return await this._client.get(this.#GET_MODELS_PATH)
  }

  async getModelById(id) {
    return await this._client.get(this.#GET_MODELS_BY_ID_CARS_PATH.replace("#", id))
  }

  async deleteCar(id) {
    return await this._client.delete(this.#DELETE_USER_CARS_PATH.replace("#", id))
  }

  async getUserCarById(id) {
    return await this._client.get(this.#GET_USER_CARS_PATH_BY_ID.replace("#", id))
  }

  async addCar(carData) {
    return await this._client.post(this.#CREATE_CAR_PATH, carData)
  }

  async modifyUserCar(id, modifyData) {
    return await this._client.put(this.#GET_USER_CARS_PATH_BY_ID.replace("#", id), modifyData)
  }
}
