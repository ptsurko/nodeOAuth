/**
 * Created with JetBrains WebStorm.
 * User: Pasha
 * Date: 6/29/13
 * Time: 3:48 PM
 * To change this template use File | Settings | File Templates.
 */

var helpers = require('./helpers'),
    util = require('./../utility'),
    apiClientRepository = require('./../repositories/ApiClientRepository'),
    accessClientRepository = require('./../repositories/AccessTokenRepository'),
    atob = require('atob'),
    btoa = require('btoa');

exports.issueTokenForClientCredentials = function(req, res) {
    var scopes = req.query.scope ? req.query.scope.split(" ") : [];
    var authHeader = req.get('Authorization');
    if(!authHeader || !helpers.hasBasicSchema(authHeader)) {
        res.set('WWW-Authenticate', 'Basic realm="test", error="invalid_client"');
        res.send(401);
    } else {
        var credentials = atob(authHeader.split(" ")[1]).split(':');
        var client_id = credentials[0],
            secret_key = credentials[1];

        apiClientRepository.find(client_id, function(error, data) {
            if(error) {
                res.send(500, {error: error});
            } else {
                var invalidScopes = helpers.validateRequestedScopes(scopes, data.scopes);
                if(invalidScopes && invalidScopes.length > 0) {
                    res.send(400, {error: "invalid_scopes", error_description: util.format("Unable to grant access for scopes '%s'.", invalidScopes.join(","))});
                }

                if(secret_key != data.secret_key) {
                    res.send(400, {error: "invalid_client"});
                } else {
                    var accessToken = createAccessToken(client_id, scopes);
                    accessClientRepository.saveAccessToken(accessToken, function(error, result) {
                        if(error) {
                            res.send(500, {error: error});
                        } else {
                            res.send(200, {
                                access_token: btoa(JSON.stringify(result))
                            })
                        }
                    });
                }
            }
        });
    }
}

function createAccessToken(client_id, scopes) {
    var current = new Date();
    return {
        scope: scopes,
        client_id: client_id,
        expiration: (new Date()).setDate(current.getDate() + 1)
    };
}