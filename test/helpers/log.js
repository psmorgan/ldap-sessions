var sinon = require('sinon');

module.exports = function () {

  return {
      info: sinon.spy()
    , warn: sinon.spy()
  };

};
