var ObjectID = require('mongodb').ObjectID;

// Define the CollectionDriver constructor method
// it stores a MongoDB client instance for later use
CollectionDriver = function(db) {
  this.db = db;
};

// Helper method getCollection -> obtain a Mongo collection by name
//  ** define Class methods by adding functions to Prototype
CollectionDriver.prototype.getCollection = function(collectionName, callback) {

  // db.collection(name,callback) fetches & returns the collection object
  this.db.collection(collectionName, function(error, the_collection) {
    if( error ) 
      callback(error);
    else
      callback(null, the_collection);
  });
};

// 
CollectionDriver.prototype.findAll = function(collectionName, callback) {
  this.getCollection(collectionName, function(error, the_collection) {
    if( error ) callback(error);
    else {
      the_collection.find().toArray(function(error, results) {
        if (error)
          callback(error);
        else
          callback(null, results);
      });
    };
  });
};

// .get obtains a single item from a collection by its _id
// This call first obtains the collection object then performs a findOne
// against the returned object. 
CollectionDriver.prototype.get = function(collectionName, id, callback) { //A
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"});
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) { //C
                if (error) callback(error);
                else callback(null, doc);
            });
        }
    });
};

exports.CollectionDriver = CollectionDriver;