'use strict';

const ValueObject = require("./ValueObject");

class DateRange extends ValueObject {

  /**
   * Create a new DateRange.
   * @param {Object} params
   * @param {(Date|string)} params.start
   * @param {(Date|string)} params.end
   */
  constructor({ start, end }) {

    // start, end - accept string and Date
    start = new Date(start);
    end = new Date(end);

    // invalid date - when getTime() is NaN
    if (isNaN(start.getTime()))
      throw new TypeError('DateRange.start must be a date');
    if (isNaN(end.getTime()))
      throw new TypeError('DateRange.end must be a date');

    super({ start, end });
  }

}

module.exports = DateRange;
