var _       = require('lodash')
,   assert  = require('assert')
,   sinon   = require('sinon')
,   sinonAP = require('sinon-as-promised')(require('bluebird'))
,   log     = require('../../helpers/log')();

var req = {
    headers: {}
  , connection: {}
};

var RedisSessions = function () {};
var ActiveDirectory = function () {};

var subject = require('../../../app/handlers/createSession.js');

describe('createSession.js', function () {

  beforeEach(function () {
    res = {
        sendStatus: sinon.spy()
      , json: sinon.spy()
    };
  });

  describe ('successful session creation', function () {

    before(function () {

      RedisSessions.prototype.create = sinon.stub().resolves(validToken());
      var rs = new RedisSessions();

      ActiveDirectory.prototype.authenticate = sinon.stub().resolves(true);
      var ldap = new ActiveDirectory();

      createSession = subject(rs, log, ldap);

    });

    it ('should return a token', function (done) {

      var request = _.defaults({
        body: {
            username: 'test'
          , password: 'test'
        }
      }, req);

      createSession(request, res)
        .then(function (result) {
          assert.deepEqual(res.json.firstCall.args[0], validToken());
          done();
        });

    });

  });

  describe ('invalid token sent back', function () {

    before(function () {

      RedisSessions.prototype.create = sinon.stub().resolves(null);
      var rs = new RedisSessions();

      ActiveDirectory.prototype.authenticate = sinon.stub().resolves(true);
      var ldap = new ActiveDirectory();

      createSession = subject(rs, log, ldap);

    });

    it ('should return 401', function (done) {

      var request = _.defaults({
        body: {
            username: 'test'
          , password: 'test'
        }
      }, req);

      createSession(request, res)
        .then(function () {
          assert.equal(res.sendStatus.firstCall.args[0], 401);
          done();
        });

    });

  });

  describe ('authentication failure', function () {

    before(function () {

      RedisSessions.prototype.create = sinon.stub().resolves(null);
      var rs = new RedisSessions();

      ActiveDirectory.prototype.authenticate = sinon.stub().resolves(new Error());
      var ldap = new ActiveDirectory();

      createSession = subject(rs, log, ldap);

    });

    it ('should return 401', function (done) {

      var request = _.defaults({
        body: {
            username: 'test'
          , password: 'asd'
        }
      }, req);

      createSession(request, res)
        .then(function (err) {
          assert.equal(res.sendStatus.firstCall.args[0], 401);
          done();
        });

    });

  });

  describe ('no usernameor password', function () {

    before(function () {

      createSession = subject(null, log, null);

    });

    it ('should return 401', function (done) {

      var request = _.defaults({
        body: {}
      }, req);

      createSession(request, res)
        .then(function () {
          assert.equal(res.sendStatus.firstCall.args[0], 401);
          done();
        });

    });

  });

});

function validToken () {

  return { token: 'validtoken' };

};
