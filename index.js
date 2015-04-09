// 1
var http = require('http'),
    express = require('express'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./CollectionDriver').CollectionDriver;

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

// specify where the view templates live
app.set('views', path.join(__dirname, 'views'));
// set view engine to Jade
app.set('view engine', 'jade');

app.use(express.bodyParser());

// Set Mongo & Collection Driver vars
var mongoHost = 'localHost';
var mongoPort = 27017;
var collectionDriver;

var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));
mongoClient.open(function(err, mongoClient) {
  if (!mongoClient) {
    console.log('Error! Exiting node server... Must start MongoDB first');
    process.exit(1);
  }
  // define database name
  var db = mongoClient.db("MyDatabase");
  collectionDriver = new CollectionDriver(db);
});

// site root Route Handler
app.get('/:collection', function (req, res) {
  var params = req.params;
  collectionDriver.findAll(req.params.collection, function (error, objs) {
      if (error) {
        res.send(400, error);
      }
        else {
          if (req.accepts('html')) {
            res.render('data', {objects: objs, collection: req.params.collection});
          } else {
            res.set('Content-Type', 'application/json');
            res.send(200, objs);
          }
        }
  });
});

app.get('/:collection/:entity', function(req, res) {
  var params = req.params;
  var entity = params.entity;
  var collection = params.collection;

  if (entity) {
    collectionDriver.get(collection, entity, function(error, objs) {
        if (error) {
          res.send(400, error);
        }
        else {
          res.send(200, objs);
        }
    });
  } else {
    res.send(400, {error: 'Bad url, sorry', url: req.url});
  }
});

// Post a collection to DB (references prototype.save method)
// inserts the body as an object in the specified collection
app.post('/:collection', function(req, res) {
  var object = req.body;
  var collection = req.params.collection;
  collectionDriver.save(collection, object, function(error, docs) {
    if (error) {
      res.send(400, err);
    }
    else {
      res.send(201, docs);
    }
  });
});

// Catch-all route for error handling
// displays a 404 error when the requested content can't be found
app.use(function (req, res) {
  res.render('404', {url: req.url});
});

// 1. app.use(callback) matches all requests when placed at the end
//    of our app.use/app.'verb' (get, post, etc.) list


// 2
http.createServer(app).listen(app.get('port'), function (req, res) {
  console.log('Express server listening on port ' + app.get('port'));
});

