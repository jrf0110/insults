var
  config = require('./config')
, errors = require('./errors')

, m = module.exports = {}
;

m.cors = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers['origin'] || '*'); // req.headers['origin'] is necessary to get authorization to work
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, PUT, PATCH, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
  res.setHeader('Access-Control-Expose-Headers', req.headers['access-control-request-headers']);

  // intercept OPTIONS method, this needs to respond with a zero length response (pre-flight for CORS).
  if (req.method === 'OPTIONS') return res.send(204);

  next();
};

m.auth = function(req, res, next){
  if (!req.session || !req.session.user)
    return res.error(errors.auth.NOT_AUTHENTICATED);
  
  next();
};

m.queryObj = function(req, res, next){
  req.query = {};
  req.queryOptions = {};
  next();
};

m.record = function(field){
  return function(req, res, next){
    if (req.param(field)) req.query[field] = req.param(field);
    next();
  };
};

m.validation = function(schema){
  return function(req, res, next){
    next();
  };
};

m.permissions = function(schema){
  return function(req, res, next){
    next();
  };
};

m.pagination = function(limit, offset){
  limit = limit || config.defaults.limit;
  offset = offset || 0;

  return function(req, res, next){
    req.queryOptions.offset = req.param('offset') || offset;
    req.queryOptions.limit = req.param('limit') || limit;

    next();
  };
};

m.error = function(req, res, next){
  res.error = function(error){
    console.log(error);
    if (typeof error == 'number') return res.status(error).end();

    if (!error.httpCode) error.httpCode = 400;
    res.status(error.httpCode).json(error);
  };

  next();
};