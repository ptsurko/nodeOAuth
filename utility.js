
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

function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

exports.newGuid = function() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}