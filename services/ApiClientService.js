
var mongo = require('mongodb'),
    util = require('./../utility.js');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect:true});
var db = new Db('oauthdb', server);
var apiClientsCollection = "apiclients";

exports.seed = function() {
    db.open(function(err, db) {
        if(err) {
            util.logError("Unable to connect to database. %s.", err);
        } else {
            var apiClients = [
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
            var collection = db.collection(apiClientsCollection);

            collection.drop(function(err, res) {
                collection.insert(apiClients, {safe: true, multi: true}, function(err, res) {
                    if(err) {
                        util.logError("Unable to insert test data. Error : %s", err);
                    } else {
                        util.logInfo("Successfully inserted fake data.");
                    }
                });
            })
        }
    });
};
