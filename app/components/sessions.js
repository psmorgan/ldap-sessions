var _             = require('lodash')
,   bb            = require('bluebird')
,   RedisSessions = require('redis-sessions');

exports = module.exports = function sessions (settings, log) {

  var config    = settings.get('rs') || {}
  ,   sessions  = new Sessions(config, log);

  return sessions;

};

exports['@singleton'] = true;
exports['@require'] = ['settings', 'logger'];

function Sessions (config, log) {

  var configDefaults = {
      host: 'localhost'
    , port: 6379
    , options: {
        auth_pass: null
      }
    , namespace: 'ldap'
  };

  _.defaults(config, configDefaults);

  this.log    = log;
  this.config = config;
  this._rs    = new RedisSessions(config);
  bb.promisifyAll(this._rs);
  if (this._rs.redis) {
    bb.promisifyAll(this._rs.redis);
  }
}

Sessions.prototype.create = function (username, ip, opts) {
  var config = this.config;

  if (!username || !ip) {
    return bb.reject(new Error('No username or ip supplied to create session'));
  }

  var sessionConfig = opts;

  _.defaults(sessionConfig, {
      app: config.namespace
    , ttl: config.ttl
    , id:  username
    , ip:  ip
  });

  this.log.info('[%s] Creating session for user', username);

  return this._rs.createAsync(sessionConfig)
    .bind(this)
    .then(function (result) {
      if (!sessionConfig.d) {
        return result;
      } else {
        return this._rs.redis.setAsync('oauth:' + sessionConfig.d.accessToken, result.token);
      }
    });

}

Sessions.prototype.get = function (token) {
  var config = this.config;

  this.log.info('Searching for token %s', token);
  return this._rs.getAsync({
      app: config.namespace
    , token: token
  })
  .then(function (result) {
    if (!result) {
      throw new Error('Unable to find token ' + token);
    }
    return result;
  });

}
