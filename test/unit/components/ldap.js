var assert      = require('assert')
,   sinon       = require('sinon')
,   sinonAP     = require('sinon-as-promised')(require('bluebird'))
,   proxyquire  = require('proxyquire').noCallThru()
,   util        = require('util');

var log = require('../../helpers/log')();

var settings    = {
  get: sinon.stub()
};

var LDAPError = function (errorName, errorCode) {
  this.__defineGetter__('code', function () {
    return errorCode;
  });
  this.__defineGetter__('name', function () {
    return errorName;
  });
};
util.inherits(LDAPError, Error);

var ActiveDirectory = function () {};

var subject = proxyquire('../../../app/components/ldap', {
  'activedirectory': ActiveDirectory
});

var ldap = subject(settings, log);

describe('ldap.js', function () {

  describe ('successful auth', function () {

    before(function () {

      ActiveDirectory.prototype.findUser = sinon.stub().yieldsAsync(null, findUserSuccess());
      ActiveDirectory.prototype.authenticateAsync = sinon.stub().resolves(true);

    });

    it ('should return true', function (done) {

      ldap.authenticate('test', 'test')
        .then(function (result) {
          assert.equal(result, true);
          done();
        });

    });

  });

  describe ('successful search but failed auth', function () {

    before(function () {

      ActiveDirectory.prototype.findUser = sinon.stub().yieldsAsync(null, findUserSuccess());
      ActiveDirectory.prototype.authenticateAsync = sinon.stub().rejects(failedAuthenticationError());

    });

    it ('should throw an error', function (done) {

      ldap.authenticate('test', 'wrongpass')
        .catch(function (err) {
          assert.equal(err.message, 'Authentication failed');
          done();
        });


    });

  });

  describe ('failed search', function () {

    before(function () {

      ActiveDirectory.prototype.findUser = sinon.stub().yieldsAsync(null);

    });

    it ('should throw an error', function (done) {

      ldap.authenticate('noaccount', 'pass')
        .catch(function (err) {
          assert.equal(err.message, '[noaccount] Unable to find user');
          done();
        });

    });

  });



});

function findUserSuccess () {
  return {
      "dn": "CN=Bob\\, Rob,OU=Test,OU=General,OU=User Accounts,DC=test,DC=com"
    , "cn": "Rob Bob"
    , "sn": "Bob"
    , "description": "A test account"
    , "givenName": "Bob"
    , "displayName": "Bob, Rob"
    , "sAMAccountName": "test"
  };
};

function failedAuthenticationError () {
  return new LDAPError('Auth Failed', 49);
};
