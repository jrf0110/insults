
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
  app.set('port', process.env.INSULTS_PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('TODO: Replace cookie parser'));
  app.use(express.cookieSession());
  app.use(m.error);
  app.use(app.router);

  db.init({
    collections:      config.db.collections
  , connectionString: config.db.connectionString
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());

  // Use nginx in prod
  app.use(express.static(path.join(__dirname, 'public')));
});

app.post('/oauth'
, routes.oauth.auth
);

app.get( '/oauth'
, routes.oauth.get
);

app.get( '/session'
, routes.session.get
);

app.del( '/session'
, routes.session.remove
);

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
, m.auth
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
