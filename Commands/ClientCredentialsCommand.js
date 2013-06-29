var util = require('util');

exports.execute = function(req, callback) {
    var authorizationHeader = req.get('Authorization');
    if(!authorizationHeader || authorizationHeader.split(' ').length != 2 && authorizationHeader.split(' ')[0] != "Bearer") {

    } else {

    }
}