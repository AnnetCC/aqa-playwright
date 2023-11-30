import { expect } from "@playwright/test"

export const VALID_POST_CARS_RESPONSE_BODY = {
  status: "ok",
  data: {
    id: expect.any(Number),
    carCreatedAt: expect.any(String),
    updatedMileageAt: expect.any(String),
    carBrandId: 3,
    carModelId: 14,
    initialMileage: 100,
    mileage: 100,
    brand: "Ford",
    model: "Mondeo",
    logo: "ford.png"
  }
}

export const VALID_GET_CARS_RESPONSE_BODY = {
  status: "ok",
  data: [
    {
      carBrandId: 5,
      id: expect.any(Number),
      carCreatedAt: expect.any(String),
      updatedMileageAt: expect.any(String),
      carModelId: 21,
      initialMileage: 122,
      mileage: 122,
      brand: "Fiat",
      model: "Panda",
      logo: "fiat.png"
    },
    {
      carBrandId: 1,
      carModelId: 5,
      id: expect.any(Number),
      carCreatedAt: expect.any(String),
      updatedMileageAt: expect.any(String),
      initialMileage: 90,
      mileage: 90,
      brand: "Audi",
      model: "A8",
      logo: "audi.png"
    },
    {
      carBrandId: 2,
      carModelId: 6,
      id: expect.any(Number),
      carCreatedAt: expect.any(String),
      updatedMileageAt: expect.any(String),
      initialMileage: 110,
      mileage: 110,
      brand: "BMW",
      model: "3",
      logo: "bmw.png"
    },
    {
      carBrandId: 3,
      carModelId: 12,
      id: expect.any(Number),
      carCreatedAt: expect.any(String),
      updatedMileageAt: expect.any(String),
      initialMileage: 120,
      mileage: 120,
      brand: "Ford",
      model: "Focus",
      logo: "ford.png"
    }
  ]
}
export const VALID_PUT_CARS_RESPONSE_BODY = {
  status: "ok",
  data: {
    id: expect.any(Number),
    carBrandId: 4,
    carModelId: 18,
    initialMileage: 122,
    updatedMileageAt: expect.any(String),
    carCreatedAt: expect.any(String),
    mileage: 189,
    brand: "Porsche",
    model: "Panamera",
    logo: "porsche.png"
  }
}
