'use strict';

const CommandHandler = require('../modules/CommandHandler');
const DateRange = require('../types/DateRange');
const CarMapper = require('../mappers/CarMapper');

module.exports = function(app, { db }) {
  app.get('/price', {
    schema: {
      query: {
        type: 'object',
        properties: {
          car_id: { type: 'number' },
          date_start: { type: 'string' /*, format: 'date-time' */ }, // commented out, doesn't work in Chrome
          date_end: { type: 'string' /*, format: 'date-time' */ } // commented out, doesn't work in Chrome
        },
        required: [ 'car_id', 'date_start', 'date_end' ]
      }
    }
  }, async function(request, reply) {
    const car_id = request.query.car_id;
    const start = new Date(request.query.date_start);
    const end = new Date(request.query.date_end);

    const { price, days, car } = await new CommandHandler({ db })
      .getOffer(car_id, new DateRange({ start, end }));

    reply.view('price', {
      car,
      price,
      rental: { start, end, days },
      timestamp: new Date()
    });
  });
};
