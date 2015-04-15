var _             = require('lodash')
,   bb            = require('bluebird')
,   RedisSessions = require('redis-sessions');

exports = module.exports = function sessions (settings, log) {

  var config    = settings.get('rs')
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
}

Sessions.prototype.create = function (username, ip) {
  var config = this.config;

  this.log.info('[%s] Creating session for user', username);

  return this._rs.createAsync({
      app: config.namespace
    , ttl: config.ttl
    , id:  username
    , ip:  ip
  });

}

Sessions.prototype.get = function (token) {
  var config = this.config;

  this.log.info('Searching for token %s', token);
  return this._rs.getAsync({
      app: config.namespace
    , token: token
  });

}
