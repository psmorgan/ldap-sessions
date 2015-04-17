var _   = require('lodash')
,   bb  = require('bluebird');

exports = module.exports = function createSessionRoute (rs, log, ldap) {

  function createSession (req, res) {

    var username  = req.body.username
    ,   password  = req.body.password
    ,   ip        = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (!username || !password) {
      log.info('Username or password not supplied');
      res.sendStatus(401);
      return bb.resolve();
    }

    return ldap.authenticate(username, password)
      .then(rs.create.bind(rs, username, ip))
      .then(function (result) {
        if (result.token) {
          log.info('[%s] Successfully created token %s', username, result.token);
          return res.json(result);
        } else {
          throw new Error('[' + username + '] Failed to create token.');
        }
      })
      .catch(function (err) {
        log.warn('[%s] Failed: %s', username, err);
        return res.sendStatus(401);
      });

  }

  return createSession;

}

exports['@require'] = ['sessions', 'logger', 'ldap'];
