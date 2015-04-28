var oauthServer = require('oauth2-server')
,   moment      = require('moment');

exports = module.exports = function oauth (ldap, mongoose, settings) {

  var oauthSettings = settings.get('oauth');

  return oauthServer({
      model:  new Model(ldap, mongoose)
    , grants: ['password', 'refresh_token']
    , accessTokenLifetime: oauthSettings.accessTokenLifetime
  });

};

exports['@singleton'] = true;
exports['@require']   = ['ldap', 'mongoose', 'settings'];

var Model = function (ldap, mongoose, settings) {
  this.ldap     = ldap;
  this.mongoose = mongoose;
  this.settings = settings;
  this.models   = this.mongoose.models;
}

Model.prototype.getClient = function (clientId, clientSecret, callback) {
  callback(null, true);
}

Model.prototype.grantTypeAllowed = function (clientId, grantType, callback) {
  if (grantType === 'password' || grantType === 'refresh_token') {
    callback(null, true);
  } else {
    callback(true);
  }
}

Model.prototype.getUser = function (username, password, callback) {

  return this.ldap.authenticate(username, password)
    .then(function (result) {
      if (result === true) {
        callback(null, username);
      } else {
        callback(null, null);
      }
    }, function (err) {
      callback(null, null);
    });

}

Model.prototype.saveAccessToken = function (accessToken, clientId, expires, userId, callback) {

  if (userId.id) {
    userId = userId.id;
  }

  var token = new this.models.accessTokens({
      accessToken: accessToken
    , clientId: clientId
    , userId: userId
    , expires: expires
  });

  token.save(callback);

}

Model.prototype.saveRefreshToken = function (token, clientId, expires, userId, callback) {

  if (userId.id) {
    userId = userId.id;
  }

  var refreshToken = new this.models.refreshTokens({
      refreshToken: token
    , clientId:     clientId
    , userId:       userId
    , expires:      expires
  });

  refreshToken.save(callback);

};

Model.prototype.getRefreshToken = function (refreshToken, callback) {

  this.models.refreshTokens.findOne({ refreshToken: refreshToken }, callback);

};
