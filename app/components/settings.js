var _ = require('lodash');

exports = module.exports = function settings () {
  var settings = new Settings();

  settings.set('env', process.env.NODE_ENV || 'development');

  var config    = this.App.config || {};
  Object.keys(config).forEach(function (key) {
    settings.set(key, config[key]);
  });

  return settings;
};

exports['@singleton'] = true;

function Settings () {
  this._hash = {};
}

Settings.prototype.set = function (key, val) {
  this._hash[key] = val;
};

Settings.prototype.get = function (key) {
  return this._hash[key];
}
