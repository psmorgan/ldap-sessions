var assert      = require('assert')
,   restify     = require('restify')
,   proxyquire  = require('proxyquire')
,   sinon       = require('sinon')
,   sinonap     = require('sinon-as-promised')
,   request     = require('supertest')
,   restify     = require('restify');

var winston = {
  info: sinon.stub()
};
var sessions = {
    create:   sinon.stub()
  , getAsync: sinon.stub()
}

var server  = restify.createServer()
,   routes  = (require('../routes'))(server, {}, winston, sessions);

describe('GET /sessions/:token', function () {

  describe('unknown token', function () {

    before(function () {

      sessions.getAsync.onCall(0).resolves({});

    })

    it ('should return 404', function (done) {

      request(server)
        .get('/sessions/283LJgsWPLI1qV2Beoh0TEkvAcFk7ojoMcA0b8MQsCTa27XKvkblORk5VZi8exibcd')
        .expect(404, done);

    });

  });

});

describe('POST /sessions', function () {

  describe('missing username or password', function () {

    it ('should return 401 with no username and password', function (done) {

      request(server)
        .post('/sessions')
        .expect(401, done);

    });

    it ('should return 401 with username but no password', function (done) {

      request(server)
        .post('/sessions')
        .send({ username: 'test'})
        .expect(401, done);

    });

    it ('should return 401 with no username with password', function (done) {

      request(server)
        .post('/sessions')
        .send({ password: 'test' })
        .expect(401, done);

    });

  });

});
