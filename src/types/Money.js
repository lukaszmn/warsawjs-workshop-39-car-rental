'use strict';

const ValueObject = require("./ValueObject");

class Money extends ValueObject {

  constructor({ amount, currency }) {

    if (typeof amount !== 'number' || isNaN(amount))
      throw new TypeError('Money.amount must be a number');

    if (typeof currency !== 'string' || currency.length !== 3)
      throw new TypeError('Money.currency must be a 3-letter ISO code');

    super({ amount, currency });
  }

}

module.exports = Money;

/*
const money = new Money({ amount: 10, currency: 'PLN'});
money.amount = 15;
// TypeError: Cannot assign to read only property 'amount' of object '#<Money>'
*/
