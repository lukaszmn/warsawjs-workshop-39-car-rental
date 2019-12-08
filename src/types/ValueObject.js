'use strict';

class ValueObject {

  constructor(data) {
    Object.assign(this, data);

    // immutable - cannot add new, modify or delete properties
    Object.freeze(this);
  }

}

module.exports = ValueObject;
