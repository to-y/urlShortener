"use strict";

//import mongo
const MongoClient = require("mongodb").MongoClient;
//define loopback to connect to and name of the database
const MONGODB_URI = process.env.MONGODB_URI;
//define name of collection within database
const collection_name = "urls";


module.exports = {

  //function to run connection to mongo via ip and callback function
  db: function(cb) {
    MongoClient.connect(MONGODB_URI, cb);

  },

  //function to find all objects in defined collection and put it to an array
  //@params collection name
  //@returns objects within collection
  all: function(cb) {
    //calls db function within module exports to connect to databse
    this.db(function(err, db) {
      //define collection name, find all objects, push to array
      db.collection(collection_name).find().toArray(function(err, data) {
        if (err) return cb(err);
        //return data into callback
        cb(data);
      })
    });
  },

  //function to get one object from collection in database
  //@params single shortened url name
  //@returns object which short url was found in
  get: function(url, cb) {
    this.db(function(err, db) {
      if (err) return cb(err);
      db.collection(collection_name).findOne({"shortURL": url, }, function(err, data) {
        if (err) return cb(err);
        if (data === null) return cb(new Error('Not Found'));
        cb(null, data);
      })
    });
  },

  //function to update one object within collection
  //@params short url to find the object, new long url to replace
  //@replaces old long url address with new url address
  update: function(url, newLongURL, cb) {
    this.db(function(err, db) {
      if (err) return cb(err);
      db.collection(collection_name).updateOne({"shortURL": url}, { $set: {"longURL" : newLongURL }}, function(err) {
        if (err) return cb(err);
        cb(null);
      })
    });
  },

  //function to insert new long url into collection
  //@params new long url name
  //@adds new object into collection
  insert: function(newLongURL, cb) {
    this.db(function(err, db) {
      if (err) return cb(err);
      db.collection(collection_name).insert(newLongURL, cb);
    });
  },

  //function that deletes object from the collection
  //@params finds object based on given short URL
  //@returns removal of object from the database
  delete: function(url, cb) {
    this.db(function(err, db) {
      db.collection(collection_name).deleteOne({"shortURL": url}, cb);
    });
  }
}


