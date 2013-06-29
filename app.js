var express = require('express')
    , http = require('http')
    , util = require('util')
    , path = require('path')
    , issueTokenForClientCredentials = require('./handlers/clientCredentialsRequestHandler').issueTokenForClientCredentials
    , apiClientRepository = require('./repositories/ApiClientRepository');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/oauth/token', function(req, res) {
    var grantType = req.query.grant_type;
    if(!grantType) {
        res.send(400, {error:"invalid_request", error_description:"Invalid grant type."});
    } else {
        switch(grantType.toLowerCase()) {
            case "client_credentials" :
                issueTokenForClientCredentials(req, res);
                break;
            default:
                res.send(400, {error: "unsupported_grant_type", error_description: util.format("Grant type '%s' is not supported.", grantType)});
        }
    }
})

app.get('/oauth/verify_token', function (req, res) {
    var access_token = req.query.access_token;
    if(!access_token) {
        res.send(400, {error:"invalid_request", error_description:"Missed 'access_token' query parameter."});
    } else {

    }
});

http.createServer(app).listen(app.get('port'), function(){
    apiClientRepository.seed();
    console.log('Express server listening on port ' + app.get('port'));
});
