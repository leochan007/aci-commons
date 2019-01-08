var MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'db';
var collCovName = 'demo';
var collCov;
let myClient;
let myConn;

var methods = {};

methods.getConnection = function() {
    return myConn;
}

methods.connectToMongoDb = async function() {
    return MongoClient.connect(url + dbName)
    .then(function(conn) {
        console.log('Connected to MongoDB');
        myClient = conn;
        myConn = myClient.db(dbName);
        return myConn;
    })
    .catch(function(err) {
        console.log('Error during connection');
        throw err;
    });
}

methods.closeConnection = async function() {
    myClient.close()
    .then(function() {
        console.log('Connection closed');
    })
    .catch(function(err) {
        console.log('Error closing connection');
        throw err;
    });
}

methods.createACollection = async function(collectionName) {
    return myConn.createCollection(collectionName)
    .then(function() {
        console.log('Collection', collectionName, 'created');
    })
    .catch(function(err) {
        console.log('Error during creation of collection', collectionName);
        throw err;
    });
}

methods.insert = async function(collectionName, obj) {
    return myConn.collection(collectionName).updateOne(obj, {$set: obj}, {upsert: true})
    .then(function(res) {
        console.log('Inserted 1 element in', collectionName);
    })
    .catch(function(err) {
        console.log('Error during insertion in', collectionName);
        throw err;
    });
}

module.exports = methods;
