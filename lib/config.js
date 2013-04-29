var
  util    = require('util')
, config  = {}
, env     = process.env['INSULTS_ENV'] || 'dev';

config.default = {
  defaults: {
    limit: 30
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