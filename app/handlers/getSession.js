exports = module.exports = function getSessionRoute (rs, log) {

  function getSession (req, res) {

    return rs.get(req.params.token)
      .then(function (result) {
        res.json(result);
      });

  }

  return getSession;

}

exports['@require'] = ['sessions', 'logger'];
