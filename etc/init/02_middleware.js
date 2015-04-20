var express     = require('express')
,   bodyParser  = require('body-parser')
,   cors        = require('cors');

module.exports = function () {

  this.use(cors());
  this.use(bodyParser.json());

};
