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
app.get('/', function (req, res) {
  res.send('<html><body><h1>Hello World</h1></body></html>');
});

// Dynamic Routing (takes up to 3 path lvls, 
//  displays path components in the response body)
// suffix w/ '?' -> optional params matches /files/:filename and /files
// prefix w/ ':' -> matches /files/:filename (e.g. /foo) but not /files
  // EXAMPLE:
  // app.get('/:a?/:b?/:c?', function (req, res) {
  //   res.send(req.params.a + ' ' + req.params.b + ' ' + req.params.c);
  // });

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

