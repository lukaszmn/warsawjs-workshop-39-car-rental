'use strict';

const CarMapper = require('../mappers/CarMapper');

const listPrice = require('../strategies/listPrice');
const DateRange = require('../types/DateRange');

class Cars {

  /**
   * @param {Object} param
   * @param {(CarMapper)} param.mapper
   */
  constructor({ mapper }) {
    this._mapper = mapper;
  }

  /**
   * Get an offer for a car for a given number of days
   * @param {string} carID Car for which to compute the total price
   * @param {DateRange} dateRange Term of rental
   */
  async getOffer(carID, dateRange) {
    const mapper = this._mapper;

    const car = await mapper.find({ ID: carID });
    const { price, days } = listPrice(
      car.getListPrice(),
      dateRange
    );

    return { price, days, car }
  }
}

module.exports = Cars;
