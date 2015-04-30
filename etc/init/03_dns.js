var dns = require('dns')
,   dnsLookup = dns.lookup;

module.exports = function () {

  if (!global.App.config || !global.App.config.dns) {
    return;
  }

  var dnsSettings = global.App.config.dns;

  dns.lookup = function (domain, options, callback) {

    if (dnsSettings[domain]) {
      console.log('dns redirect for: ' + domain);
      return callback(null, dnsSettings[domain], 4);
    }

    return dnsLookup.apply(this, arguments);

  };

};
