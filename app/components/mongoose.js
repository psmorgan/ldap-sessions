var mongoose  = require('mongoose')
,   Schema    = mongoose.Schema;

exports = module.exports = function mongooseComponent (settings) {

  var oauthSettings = settings.get('oauth');

  mongoose.connect(oauthSettings.url, function (err) {
    if (err) throw err;
  });

  mongoose.model('accessTokens', new Schema({
      accessToken:  { type: String  }
    , clientId:     { type: String  }
    , userId:       { type: String  }
    , expires:      { type: Date    }
  }));

  mongoose.model('refreshTokens', new Schema({
      refreshToken: { type: String  }
    , clientId:     { type: String  }
    , userId:       { type: String  }
    , expires:      { type: Date    }
  }));



  return mongoose;

}

exports['@singleton'] = true;
exports['@require']   = ['settings'];
