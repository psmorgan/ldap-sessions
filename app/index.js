var http      = require('http')
,   express   = require('express')
,   bootable  = require('bootable');

var port = process.env.VCAP_APP_PORT || 8080;

var app = bootable(express());

app.phase(require('bootable-environment')('etc/env'));
app.phase(bootable.initializers('etc/init', app));
app.phase(bootable.routes(__dirname + '/routes.js', app));
app.phase(function listen (done) {
  http.createServer(app).listen(port, function (err) {
    if (err) { return done(err); }

    var addr = this.address();
    console.log('server listening on http://' + addr.address + ':' + addr.port);
    done();
  });
});

module.exports = app;
