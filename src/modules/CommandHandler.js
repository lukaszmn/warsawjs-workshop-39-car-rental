'use strict';


const listPrice = require('../strategies/listPrice');
const DateRange = require('../types/DateRange');
const Rental = require('../entities/rental');
const CarMapper = require('../mappers/CarMapper');
const RentalMapper = require('../mappers/RentalMapper');

class CommandHandler {

  constructor({ db }) {
    this._db = db;
  }

  /**
   * Get an offer for a car for a given number of days
   * @param {string} carID Car for which to compute the total price
   * @param {DateRange} dateRange Term of rental
   */
  async getOffer(carID, dateRange) {
    const mapper = new CarMapper({ db: this._db });

    const car = await mapper.find({ ID: carID });
    const { price, days } = listPrice(
      car.getListPrice(),
      dateRange
    );

    return { price, days, car }
  }

  async startRental(carID, duration, customerData) {
    const cars = new CarMapper({ db: this._db });
    const rentals = new RentalMapper({ db: this._db });

    const car = await cars.find({ ID: carID });
    const { price, days } = listPrice(car.getListPrice(), duration);

    const rental = new Rental();
    rental.start(carID, duration, price);
    await rentals.insert(rental);

    car.rent(rental.getID());
    cars.update(car);

    return { car, price, days };
  }

  async endRental(rentalID) {
    const cars = new CarMapper({ db: this._db });
    const rentals = new RentalMapper({ db: this._db });

    const rental = await rentals.find({ ID: rentalID });
    rental.end();
    await rentals.update(rental);

    const car = await cars.find({ ID: rental.getCarID() });
    car.endRental();
    await cars.update(car);
  }

}

module.exports = CommandHandler;
