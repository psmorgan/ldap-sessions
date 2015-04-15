var winston = require('winston');

exports = module.exports = function logger () {

  return winston;

}

exports['@singleton'] = true;
