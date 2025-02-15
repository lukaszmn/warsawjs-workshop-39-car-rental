'use strict';

const CommandHandler = require('../modules/CommandHandler');
const DateRange = require('../types/DateRange');

module.exports = function(app, { db }) {
  app.post('/rentals', {
    schema: {
      body: {
        type: 'object',
        properties: {
          car_id: { type: 'number' },
          date_start: { type: 'string', format: 'date-time' },
          date_end: { type: 'string', format: 'date-time' },
          customer_name: { type: 'string' },
          customer_age: { type: 'number' },
          customer_email: { type: 'string', pattern: '.+@.+' }
        },
        required: [ 'car_id', 'date_start', 'date_end', 'customer_name', 'customer_age', 'customer_email' ]
      }
    }
  }, async function(request, reply) {
    // Get all necessary data:
    const car_id = request.body.car_id;
    // For sake of exercise's simplicity, we start the rental at this moment.
    // Otherwise, we'd have to deal with a separate pick-up operation.
    const start = new Date(request.body.date_start);
    const end = new Date(request.body.date_end);

    const { car, price, days } = await db.transaction(async function(transaction) {

      const { price, days, car } = await new CommandHandler({ db: transaction })
        .startRental(
          car_id,
          new DateRange({ start, end }),
          {
            age: request.body.customer_age
          }
        );
      return { car, price, days };
    });

    reply.view('rental-started', {
      car,
      price,
      rental: { start, end, days },
      timestamp: new Date()
    });
  });
};
