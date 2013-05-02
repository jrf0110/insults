var
  util    = require('util')
, config  = {}
, env     = process.env['INSULTS_ENV'] || 'dev';

config.default = {
  
  defaults: {
    limit: 30
  }

, github: {
    // Url for github oauth
    oauthUrl:       'https://github.com/login/oauth/authorize'

    // URL to exchange code for access token
  , accessTokenUrl: 'https://github.com/login/oauth/access_token'

    // URL to get user profile and ensure user is correct user
  , userProfileUrl: 'https://api.github.com/user'

    // What we need from the user
  , scopes:         ['user']

    // The goods
  , clientId:       process.env['INSULTS_GITHUB_CLIENT_ID']
  , clientSecret:   process.env['INSULTS_GITHUB_CLIENT_SECRET']
  }
};

config.dev = {
  db: {
    connectionString: 'postgres://localhost:5432/insults'
  , collections: [
      'insults'
    ]
  }
};

config.production = {

};

if (env == null || !config.hasOwnProperty(env)) env = 'dev';

module.exports = util._extend(config.default, config[env]);

console.log('Loading ' + env + ' config');