
/**
 * Module dependencies.
 */

var
  express = require('express')
, http    = require('http')
, path    = require('path')
, db      = require('mongo-pg')

, config  = require('./lib/config')
, routes  = require('./routes')
, m       = require('./lib/middleware')
, e       = require('./lib/errors')

, app     = express()
;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(m.error);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  db.init({
    collections:      config.db.collections
  , connectionString: config.db.connectionString
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get( '/insults'
, m.queryObj
, m.permissions()
, m.validation()
, m.pagination()
, routes.generic.find(db.insults)
);

app.get( '/insults/:id'
, m.queryObj
, m.permissions()
, m.validation()
, m.record('id')
, m.pagination()
, routes.generic.findOne(db.insults)
);

app.post( '/insults'
, m.permissions()
, m.validation()
, m.queryObj
, routes.generic.insert(db.insults)
);

app.put( '/insults/:id'
, m.permissions()
, m.validation()
, m.queryObj
, m.record('id')
, routes.generic.update(db.insults)
);

app.del( '/insults/:id'
, m.permissions()
, m.queryObj
, m.record('id')
, routes.generic.remove(db.insults)
);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
