var
  request = require('request')

, config  = require('../lib/config')
, utils   = require('../lib/utils')
, errors  = require('../lib/errors')
;

module.exports.get = function(req, res){
  res.json({
    url: config.github.oauthUrl
      + '?client_id='
      + config.github.clientId
      + '&scope='
      + config.github.scopes.join(',')
  });
};

module.exports.auth = function(req, res){
  if (req.session && req.session.user) return res.status(204).end();

  var options = {
    url: config.github.accessTokenUrl + utils.queryParams({
      code:           req.body.code
    , client_id:      config.github.clientId
    , client_secret:  config.github.clientSecret
    })

  , method: 'POST'

  , json: true

  , headers: {
      'User-Agent': 'John Fawcett Hubot Insults Application User Agent'
    }
  };

  request(options, function(error, response, body){
    if (error)
      return console.log(error, body), res.error(errors.auth.UNKNOWN_OAUTH);

    if (!body.access_token)
      return res.error(errors.auth.UNKNOWN_OAUTH);

    var url = config.github.userProfileUrl + '?access_token=' + body.access_token;
    var accessToken = body.access_token;

    options.url = url;
    options.method = 'GET';
    delete options.json;

    // Get user profile
    request(options, function(error, response, body){
      if (error) return res.error(errors.auth.INVALID_ACCESS_TOKEN);

      body = JSON.parse(body);

      if (!body.organizations_url) res.error(errors.auth.INVALID_ACCESS_TOKEN);

      options.url = body.organizations_url;

      request(options, function(error, response, body){
        if (error) return res.error(errors.auth.INVALID_ACCESS_TOKEN);

        body = JSON.parse(body);
        if (body.filter(function(org){
          return org.login.toLowerCase() == 'goodybag';
        }).length == 0) return res.error(errors.auth.INVALID_ACCESS_TOKEN);

        req.session.user = body;
        req.session.user.accessToken = accessToken;

        res.json(body);
      });
    });
  });
};