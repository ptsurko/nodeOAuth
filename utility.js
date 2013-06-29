
var util = require('util');

exports.logInfo = function() {
    console.info(util.format.apply(null, arguments));
}

exports.logWarn = function() {
    console.warn(util.format.apply(null, arguments));
}

exports.logError = function() {
    console.error(util.format.apply(null, arguments));
}