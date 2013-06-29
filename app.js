var express = require('express')
    , http = require('http')
    , util = require('util')
    , path = require('path')
    , clientCredentialsService = require('./services/ClientCredentialsService.js')
    , apiClientService = require('./services/ApiClientService.js');

apiClientService.seed();

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.get('/oauth/token', function(req, res) {
    var grantType = req.query.grant_type;
    if(grantType) {
        switch(grantType.toLowerCase()) {
            case "client_credentials" :
                var scope = req.query.scope ? req.query.scope.split(" ") : [];
                var authHeader = req.get('Authorization');
                if(!authHeader || !hasBasicSchema(authHeader)) {
                    res.set('WWW-Authenticate', 'Basic realm="test", error="invalid_client"');
                    res.send(401);
                } else {
                    clientCredentialsService.issueToken(authHeader.split(" ")[1], scope, function(error, data) {
                        if(error) {

                        } else {
                            res.send(200, {access_token: "test"});
                        }
                    });
                }
                break;
            default:
                res.send(400, {error: "unsupported_grant_type", error_description: util.format("Grant type '%s' is not supported.", grantType)});
        }
    } else {
        res.send(400, {error:"invalid_request", error_description:"Invalid grant type."})
    }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


function hasBasicSchema(authHeader) {
    return authHeader.split(' ').length >= 2 && authHeader.split(' ')[0].toLowerCase() != "bearer";
}