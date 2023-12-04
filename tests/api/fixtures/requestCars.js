import CreateCarModel from "../../../src/models/cars/CreateCarModel.js"

export const CAR_MODELS = [
  new CreateCarModel({
    carBrandId: 5,
    carModelId: 21,
    mileage: 122
  }),
  new CreateCarModel({
    carBrandId: 1,
    carModelId: 5,
    mileage: 90
  }),
  new CreateCarModel({
    carBrandId: 2,
    carModelId: 6,
    mileage: 110
  }),
  new CreateCarModel({
    carBrandId: 3,
    carModelId: 12,
    mileage: 120
  })
]
