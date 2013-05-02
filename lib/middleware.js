var
  config = require('./config')
, errors = require('./errors')

, m = module.exports = {}
;

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