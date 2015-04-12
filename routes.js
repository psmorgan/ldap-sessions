module.exports = function routes (server, config, winston, sessions, ldap) {

  server.get('/sessions/:token', function (req, res) {

    return sessions.getAsync({
        app:    server.name
      , token:  req.params.token
    })
    .then(function (result) {
      if (!result.id) {
        winston.info('Token not found: %s', req.params.token);
        return res.json(404, { error: 'Token not found' });
      } else {
        return res.json(200, { id: result.id });
      }
    })
    .catch(function (err) {
      winston.error(err);
      res.send(500, { error: 'Failed' });
    });

  });

  server.post('/sessions', function (req, res) {
    var username = req.params.username
    ,   password = req.params.password;

    if (!username || !password) {
      winston.info('Username or password not supplied.');
      return res.send(401);
    }

    ldap.authenticate(req.params.username, req.params.password)
      .then(function (result) {
        winston.info('Successfully authenticated user %s', req.params.username);
        return sessions.createAsync({
            app:  server.name
          , ttl:  config.rs.ttl
          , id:   req.params.username
          , ip:   req.connection.remoteAddress
        });
      })
      .then(function (result) {
        if (result.token) {
          winston.info('Created a token for user %s: %s', req.params.username, result.token);
          return res.json({
            sessions: [result]
          });
        } else {
          throw new Error('RedisSessions failed to create a token.');
        }
      })
      .catch(function (err) {
        winston.error(err);
        res.send(500, { error: 'Failed' });
      });

  });

};
