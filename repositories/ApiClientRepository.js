
var mongoClient = require('mongodb').MongoClient,
    util = require('./../utility.js');

var apiClientsCollection = "apiclients",
    accessTokensCollection = "accesstokens";

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
    mongoClient.connect('mongodb://localhost:27017/oauthdb', function(err, db) {
        db.collection(apiClientsCollection).drop(function(err, res) {
            db.collection(apiClientsCollection).insert(seedApiClients, {safe: true, multi: true}, function(err, res) {
                if(err) {
                    util.logError("Unable to insert test data. Error : %s", err);
                } else {
                    util.logInfo("Successfully inserted fake data.");
                }
            });
        });
        db.collection(accessTokensCollection).drop(function () {});
    });
};

exports.find = function(client_id, callback){
    mongoClient.connect('mongodb://localhost:27017/oauthdb', function(err, db) {
        util.logInfo("Searching details for client: %s.", client_id);
        db.collection(apiClientsCollection).findOne({client_id: client_id}, function(error, result) {
            if(error) {
                util.logError("Unable to find client: %s. %s.", client_id, error);
                callback(error);
            } else {
                callback(null, result);
            }
        });
    });
}