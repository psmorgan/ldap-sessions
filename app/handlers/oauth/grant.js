exports = module.exports = function grantRoute (oauth) {

  return oauth.grant();

};

exports['@require'] = ['oauth'];
