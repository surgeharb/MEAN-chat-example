const Q = require('q');
const moment = require('moment-timezone');

/**
 * General Helpers (Objects, Strings, Numbers, Booleans, ...)
 */ //===============================================================================================//

/**
 * Checks if the array contains a certain object
 *
 * @param {array} array - Array where to search
 * @param {object} object - Object to be checked
 * @param {string} [field] - Field to be compared
 *
 * @return {promise}
 */
module.exports.containsObject = function(array, object, field) {
    var deferred = Q.defer();

    if (array.length == 0) {
        deferred.resolve(false);
    }

    if (!field) {
        array.forEach(function(el, index) {
            if (JSON.stringify(el) === JSON.stringify(object)) {
                deferred.resolve({ result: true, element: el });
            } else if (index === array.length - 1) {
                deferred.resolve({ result: false });
            }
        })
    } else {
        array.forEach(function(el, index) {
            if (el[field].toString() == object[field].toString()) {
                deferred.resolve({ result: true, element: el });
            } else if (index === array.length - 1) {
                deferred.resolve({ result: false });
            }
        })
    }

    return deferred.promise;
}

/**
 * Converts the string to boolean value
 *
 * @param {object} string
 *
 * @return {boolean}
 */
module.exports.toBoolean = function(string) {
    if (string == false) {
        return false;
    } else {
        return true;
    }
}

/**
 * Checks if object is undefined
 *
 * @param {object} value
 *
 * @return {boolean}
 */
module.exports.isUndefined = function(value) {
    if (value === undefined) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks if object is null
 *
 * @param {object} value
 *
 * @return {boolean}
 */
module.exports.isNull = function(value) {
    if (value === null) {
        return true;
    } else {
        return false;
    }
}

/**
 * Adds leading zeroes to the string untill it matches the given characters length
 *
 * @param {string} string
 * @param {number} characters
 *
 * @return {string}
 */
module.exports.leadingZeroes = function(string, characters) {
    if (string === undefined || string === null) return '';
    if (characters === undefined || characters === null) zeroes = string.length;
    string = "" + string;
    var diff = parseInt(characters) - string.length;
    for (var i = 0; i < diff; i++) {
        string = "0" + string;
    }
    return string;
}

/**
 * Date Helpers
 */ //===============================================================================================//

/**
 * Gets the last midnight timestamp according to the user date
 *
 * @param {number} hours
 * @param {number} minutes
 * @param {number} seconds
 *
 * @return {number}
 */
module.exports.getLastMidnight = function(hours, minutes, seconds) {
    var timestamp = new Date().getTime();
    var time = timestamp - ((hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000));
    return time;
}

/**
 * Gets the last midnight of the first day of the month's timestamp according to the user date
 *
 * @param {number} day
 * @param {number} hours
 * @param {number} minutes
 * @param {number} seconds
 *
 * @return {number}
 */
module.exports.getCurrentMonthFirstDay = function(day, hours, minutes, seconds) {
    var timestamp = new Date().getTime();
    var time = timestamp - ((day * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000));
    return time;
}