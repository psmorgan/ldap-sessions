var moment    = require('moment')
,   mongoose  = require('mongoose');

exports = module.exports = function tokenRoute (mongoose) {

  return function tokenInfo (req, res) {

    mongoose.models.accessTokens.findOne({ accessToken: req.params.tokenid })
      .exec()
      .then(function (token) {

        if (!token) {
          return res.status(404).json({});
        }

        var expires_in = moment(token.expires).diff(moment(), 'seconds');

        if (expires_in <= 0) {
          return res.status(404).json({});
        }

        var response = {
            user_id:    token.userId
          , expires_in: expires_in
        };

        res.json(response);
      });

  };

};

exports['@require'] = ['mongoose'];
