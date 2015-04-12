var _             = require('lodash')
,   pjson         = require('./package.json')
,   restify       = require('restify')
,   winston       = require('winston')
,   port          = process.env.VCAP_PORT || 8080
,   RedisSessions = require('redis-sessions');

var env = process.env.NODE_ENV || 'development';

var config = {
  rs: {
    ttl: 3600
  }
};

if (env === 'development') {
  _.defaults(config, require('./.env.dev.json'));
}

var sessions  = (require('./lib/sessions'))(RedisSessions, config.sessions)
,   ldap      = (require('./lib/ldap'))(config.ldap)
,   routes    = require('./routes');

var server = restify.createServer({
    name:     pjson.name
  , version:  pjson.version
});

server.use(restify.CORS());
server.use(restify.queryParser());
server.use(restify.bodyParser());

routes(server, config, winston, sessions, ldap);

server.listen(port, function () {
  winston.info('Listening on %s', port);
});

module.exports = server;
