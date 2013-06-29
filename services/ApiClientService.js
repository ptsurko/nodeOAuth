
var mongo = require('mongodb'),
    util = require('./../utility.js');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect:true});
var db = new Db('oauthdb', server);
var apiClientsCollection = "apiclients";

db.open(function(err, db) {
    if(err) {
        util.logError("Unable to connect to database. %s.", err);
    } else {
        util.logInfo("Successfully connected to database %s.", db.databaseName);
    }
});

var seedApiClients = [
    {
        _id: "1",
        client_id : "1",
        secret_key: "secret_for_1",
        scopes: [
            "api",
            "admin",
            "superadmin"
        ]
    },
    {
        _id: "2",
        client_id : "2",
        secret_key: "secret_for_2",
        scopes: [
            "api"
        ]
    }
];
exports.seed = function() {
    var collection = db.collection(apiClientsCollection);
    collection.drop(function(err, res) {
        collection.insert(seedApiClients, {safe: true, multi: true}, function(err, res) {
            if(err) {
                util.logError("Unable to insert test data. Error : %s", err);
            } else {
                util.logInfo("Successfully inserted fake data.");
            }
        });
    })
};

exports.findApiClientByClientIdAndSecret = function(client_id, secret_key, callback){
    util.logInfo("Searching details for client: %s", client_id);
    db.collection(apiClientsCollection).find({client_id: client_id, secret_key: secret_key}).toArray(function(error, result) {
        if(error) {
            util.logError("Unable to find client: %s. %s", client_id, error);
            callback(error);
        } else {
            callback(null, result[0]);
        }
    });
}
