var
  config = require('./config')

, m = module.exports = {}
;

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
    if (typeof error == 'number') return res.status(error).end();

    if (!error.code) error.code = 400;
    res.status(error.code).json(error);
  };

  next();
};