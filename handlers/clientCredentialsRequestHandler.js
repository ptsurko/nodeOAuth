/**
 * Created with JetBrains WebStorm.
 * User: Pasha
 * Date: 6/29/13
 * Time: 3:48 PM
 * To change this template use File | Settings | File Templates.
 */

var helpers = require('./helpers'),
    util = require('./../utility'),
    apiClientService = require('./../services/ApiClientService.js'),
    atob = require('atob');

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

        apiClientService.findApiClientByClientIdAndSecret(client_id, secret_key, function(error, data) {
            if(error) {

            } else {
                var invalidScopes = helpers.validateRequestedScopes(scopes, data.scopes);
                if(invalidScopes && invalidScopes.length > 0) {
                    res.send(400, {error: "invalid_scopes", error_description: util.format("Unable to grant access for scopes '%s'.", invalidScopes.join(","))});
                }

                res.send(200, "test");
            }
        });
    }
}