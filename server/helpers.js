module.exports.validateBoatSet = boats => {
  if (boats.length !== 10) {
    return 'You must have exactly 10 boats';
  }

  return null;
}

const { v4: uuidv4 } = require('uuid');
module.exports.newId = uuidv4;