var _     = require('lodash')
,   bb    = require('bluebird')
,   retry = require('bluebird-retry')
,   ActiveDirectory = require('activedirectory');

exports = module.exports = function (settings, log) {

  var config  = settings.get('ldap')
  ,   ldap    = new Ldap(config, log);
  return ldap;

};

exports['@singleton'] = true;
exports['@require'] = ['settings', 'logger'];

function Ldap (config, log) {

  this.log      = log;
  this._client  = new ActiveDirectory(config);
  bb.promisifyAll(this._client);

};

Ldap.prototype.authenticate = function (username, password) {

  var client = this._client;

  var find = function find () {

    this.log.info('[%s] Searching for user', username);
    return client.findUserAsync(username);

  }.bind(this);

  var auth = function (account) {
    var username        = account.sAMAccountName.toLowerCase()
    ,   passwordLength  = Array(password.length + 1).join('*');
    this.log.info('[%s] Attempting to authenticate %s (%s)', username, account.displayName, passwordLength);

    return client.authenticateAsync(account.dn, password)
      .bind(this)
      .timeout(2000)
      .then(function (result) {
        if (result) {
          this.log.info('[%s] Authentication successful', username);
          return result;
        } else {
          throw new Error('[' + username + '] Authentication failed (not thrown)');
        }
      })
      .catch(function (err) {
        if (err.code === 49) {
          this.log.info('[%s] Authentication failed (invalid credentials)', username);
          return bb.reject(new Error('Authentication failed'));
        } else {
          this.log.warn('[%s] Authentication failed (other reason)', username);
          return bb.reject(err);
        }
      });

  }.bind(this);

  var time = process.hrtime();

  return find()
    .bind(this)
    .then(function (account) {
      if (!account) {
        this.log.info('[%s] Unable to find user', username);
        throw new Error('[' + username + '] Unable to find user');
      }
      return account;
    })
    .then(function (account) {
      return auth(account);
    })
    .then(function (result) {
      var diff  = process.hrtime(time)
      ,   taken = (parseInt(diff[0]) + parseFloat(diff[1] * 1.0e-9)).toFixed(2);
      this.log.info('[%s] Authentication attempt took %ss', username, taken);
      if (result) {
        return result;
      } else {
        throw new Error('[' + username + '] Failed to authenticate')
      }
    })


};
