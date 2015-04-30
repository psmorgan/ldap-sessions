var assert  = require('assert')
,   sinon   = require('sinon')
,   sinonAP = require('sinon-as-promised')(require('bluebird'))
,   log     = require('../../helpers/log')();

var RedisSessions = function () {};
var subject = require('../../../app/handlers/getSession.js');

var resX = (function () {
  function resMock () {};
  resMock.prototype.status  = sinon.stub().returns(resMock.prototype);
  resMock.prototype.json    = sinon.stub().returns(resMock.prototype);
  return resMock;
})();

describe('getSession.js', function () {

  describe ('successfully retrieve token', function () {

    before(function () {
      RedisSessions.prototype.get = sinon.stub().resolves(validSession());
      var rs = new RedisSessions();
      getSession = subject(rs, log);
    });

    it ('should return 200', function (done) {

      var res = new resX();
      var request = {
        params: {
          token: 'validtoken'
        }
      };

      getSession(request, res)
        .then(function () {
          assert.equal(200, res.status.firstCall.args[0]);
          done();
        });

    });

  });

});

function validSession () {
  return {
    "id": "asd09",
    "r": 3,
    "w": 1,
    "ttl": 3600,
    "idle": 12,
    "ip": "::1"
  };
};
