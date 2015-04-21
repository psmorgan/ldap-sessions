exports = module.exports = function getSessionRoute (rs, log) {

  function getSession (req, res) {

    return rs.get(req.params.token)
      .then(function (result) {
        if (!result || !result.id) {
          return res.status(404).json({});
        } else {
          return res.status(200).json({});
        }
      })
      .catch(function (err) {
        log.warn('Failed to get token: %s (%s)', err.message, req.params.token);
        return res.status(404).json({});
      });

  }

  return getSession;

}

exports['@require'] = ['sessions', 'logger'];
