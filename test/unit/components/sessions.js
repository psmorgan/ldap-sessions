var assert      = require('assert')
,   sinon       = require('sinon')
,   sinonAP     = require('sinon-as-promised')(require('bluebird'))
,   proxyquire  = require('proxyquire').noCallThru();

var settings    = {
  get: sinon.stub()
};

var log = {
    info: sinon.spy()
  , warn: sinon.spy()
};

var RedisSessions = function () {};

var subject = proxyquire('../../../app/components/sessions', {
  'redis-sessions': RedisSessions
});

var sessions = subject(settings, log);

describe('sessions.js', function () {

  describe ('no username or password supplied', function () {

    it ('should throw an error', function (done) {

      sessions.create(null, null)
        .catch(function (err) {
          assert.equal(err.message, 'No username or ip supplied to create session');
          done();
        });

    });

  });

  describe ('unable to find token', function () {

    before(function () {

      RedisSessions.prototype.getAsync = sinon.stub().resolves(null);

    });

    it ('should throw an error', function (done) {

      var token = 'agoehaoughaougheaogheao';

      sessions.get.call(sessions, token)
        .catch(function (err) {
          assert.equal(err.message, 'Unable to find token ' + token);
          done();
        });

    });

  });

});
