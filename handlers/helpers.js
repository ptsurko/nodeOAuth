var atob = require('atob');

exports.validateRequestedScopes = function(requestedScopes, clientScopes) {
    var res = [];
    for(var i = 0; i < requestedScopes.length; i++) {
        if(clientScopes.indexOf(requestedScopes[i]) < 0) {
            res.push(requestedScopes[i]);
        }
    }
    return res;
}

exports.hasBasicSchema = function(authHeader) {
    try {
        return authHeader.split(' ').length >= 2
            && authHeader.split(' ')[0].toLowerCase() == "basic"
            && atob(authHeader.split(' ')[1]).split(':').length == 2;
    } catch (e) {
        return false;
    }
};
