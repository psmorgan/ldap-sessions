var ioc = require('electrolyte');

module.exports = function routes () {

  this.get('/debug',            ioc.create('handlers/debug'));
  this.get('/sessions/:token',  ioc.create('handlers/getSession'));
  this.post('/sessions',        ioc.create('handlers/createSession'));

  this.post('/oauth/token',             ioc.create('handlers/oauth/grant'));
  this.get('/oauth/tokeninfo/:tokenid', ioc.create('handlers/oauth/tokeninfo'));
  this.use(ioc.create('handlers/oauth/error'));

};
