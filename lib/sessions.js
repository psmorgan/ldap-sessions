var _             = require('lodash')
,   bb            = require('bluebird');

var configDefaults = {
    host: 'localhost'
  , port: 6379
  , options: {
      auth_pass: null
    }
  , namespace: 'ldap'
};

module.exports = function sessions (RedisSessions, config) {
  var sessionsConfig = _.defaults({
      host: config.host
    , port: config.port
    , options: {
        auth_pass: config.pass
      }
  }, configDefaults);

  var rs = new RedisSessions(sessionsConfig);
      bb.promisifyAll(rs);

  return rs;
};
