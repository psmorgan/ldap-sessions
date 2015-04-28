var mongoose  = require('mongoose')
,   Schema    = mongoose.Schema;

exports = module.exports = function mongooseComponent (settings) {

  var oauthSettings = settings.get('oauth');

  mongoose.connect(oauthSettings.url);

  mongoose.model('accessTokens', new Schema({
      accessToken:  { type: String  }
    , clientId:     { type: String  }
    , userId:       { type: String  }
    , expires:      { type: Date    }
    , createdAt:    { type: Date, expires: oauthSettings.accessTokenLifetime, default: Date.now }
  }));

  mongoose.model('refreshTokens', new Schema({
      refreshToken: { type: String  }
    , clientId:     { type: String  }
    , userId:       { type: String  }
    , expires:      { type: Date    }
    , createdAt:    { type: Date, expires: oauthSettings.refreshTokenLifetime, default: Date.now }
  }));

  return mongoose;

}

exports['@singleton'] = true;
exports['@require']   = ['settings'];
