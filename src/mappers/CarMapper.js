'use strict';

const Car = require('../entities/car');
const FastCar = require('../entities/FastCar');

class CarMapper {

  constructor({ db }) {
    this._db = db;
  }

  fromRow(row) {
    let carContructor;
    if (row.policy === 'fast')
      carContructor = FastCar;
    else
      carContructor = Car;

    return new carContructor({
      carID: row.car_id,
      make: row.make,
      model: row.model,
      plate: row.plate,
      listPrice: { amount: row.list_price_amount, currency: row.list_price_currency },
      rented: row.rented,
      rentalID: row.rental_id,
      policy: row.policy,
    });
  }

  toRow(car) {
    return {
      car_id: car.getID(),
      make: car.getMake(),
      model: car.getModel(),
      plate: car.getPlate(),
      list_price_amount: car.getListPrice().amount,
      list_price_currency: car.getListPrice().currency,
      rented: car.isRented(),
      rental_id: car.getRentalID(),
      policy: car.getPolicy(),
    };
  }

  async find({ ID }) {
    const row = await this._db('cars')
      .first()
      .where({ car_id: ID });

    if (!row)
      return Promise.reject(new Error('No entry found for car: ' + ID));

     return this.fromRow(row);
  }

  async update(car) {
    if (!car.getID())
      return Promise.reject(new Error('Car without ID cannot be saved'));

    const row = this.toRow(car);
    return await this._db('cars').update(row).where({ car_id: car.getID() });
  }

}

module.exports = CarMapper;
