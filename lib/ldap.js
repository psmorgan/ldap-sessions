var _       = require('lodash')
,   bb      = require('bluebird')
,   ldap    = require('ldapjs');

var client = function (config) {
  if (!config.host || !config.username || !config.password || !config.search) {
    throw new Error('Not all LDAP variables set.');
  }
  _.merge(this, config);

  this.ldap = ldap.createClient({ url: this.host });
  bb.promisifyAll(this.ldap);
}

client.prototype.authenticate = function (username, password) {
  var _this = this;

  return this.ldap.bindAsync(this.username, this.password)
    .then(function () {
      return _this._search(username)
    })
    then(function (dn) {
      return _this.ldap.bindAsync(dn, password);
    });
};

client.prototype._search = function (username) {

  var options = {
      filter: '(sAMAccountName=' + username + ')'
    , scope:  'sub'
  };

  if (!username) {
    return bb.reject(new Error('Must provide username to search for'));
  }

  return this.ldap.searchAsync(this.search, options)
    .then(function (search) {

      return new bb(function (resolve, reject) {

        var user;

        search.on('searchEntry', function (entry) {
          user = entry.raw;
        });

        search.on('error', function (err) {
          return reject(new Error('Search failed: ', err));
        });

        search.on('end', function () {
          if (user && user.dn) {
            return resolve(user.dn);
          } else {
            return reject('User not found: ' + username);
          }
        });

      });

    });

};

module.exports = function Ldap (config) {
  return new client(config);
}
