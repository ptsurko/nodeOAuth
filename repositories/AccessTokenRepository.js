/**
 * Created with JetBrains WebStorm.
 * User: Pasha
 * Date: 6/29/13
 * Time: 10:18 PM
 * To change this template use File | Settings | File Templates.
 */

var mongoClient = require('mongodb').MongoClient,
    util = require('./../utility.js');

var accessTokensCollection = "accesstokens";

exports.saveAccessToken = function(token, callback) {
    mongoClient.connect('mongodb://localhost:27017/oauthdb', function(err, db) {
        token._id ?  util.logInfo("Saving access token: %s for client: %s.", token._id, token.client_id) : util.logInfo("Creating access token for client: %s.", token.client_id);
        db.collection(accessTokensCollection).findAndModify({_id: token._id}, {}, token, {new: true, upsert: true}, function(error, result) {
            if(error) {
                util.logError("Unable to save access token: %s. %s.", token._id, error);
                callback(error);
            } else {
                callback(null, result);
            }
        })
    });
}

exports.findAccessToken = function(token_id, callback) {
    mongoClient.connect('mongodb://localhost:27017/oauthdb', function(err, db) {
        util.logInfo("Searching details for access token: %s.", token_id);
        db.collection(accessTokensCollection).findOne({token_id: token_id}, function(error, result) {
            if(error) {
                util.logError("Unable to find access token: %s. %s.", token_id, error);
                callback(error);
            } else {
                callback(null, result);
            }
        });
    });
}