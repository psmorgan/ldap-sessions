exports = module.exports = function oauthErrorHandler (oauth, log) {

  return function (err, req, res, next) {
    if (err.code === 500 || err.code === 503) {
      log.warn('OAuth Error: %s', err.stack);
    }

    delete err.name;
    delete err.message;
    delete err.stack;

    if (err.headers) res.set(err.headers);
    delete err.headers;

    res.status(err.code).send(err);

  }

};

exports['@require'] = ['oauth', 'logger'];
