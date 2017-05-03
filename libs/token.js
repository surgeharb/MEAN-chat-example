const Q = require('q');
const jwt = require('jsonwebtoken');
const authHeader = require('auth-header');

/**
 * Generates a new JSON Web Token
 *
 * @param {string} id - User _id
 * @param {string} username - User's unique username
 * @returns {string} - JSON Web Token
 */
module.exports.generate = function (id, username) {
  return jwt.sign({ id: id.toString(), username: username }, process.env.APP_SECRET);
}

/**
 * Verifies the given authorization token according to the api type
 * 
 * @param {string} authorization - Authorization header of the request
 * @param {string} api - API type 
 * @returns {object} - Defining the response
 */
module.exports.verify = function (authorization, api) {
  var deferred = Q.defer();
  var error = false;

  try {
    var auth = authHeader.parse(authorization);
  } catch (err) {
    console.log("Invalid header was sent");
    error = true;
  }

  if (error || checkScheme(api) == '' || auth.scheme != checkScheme(api)) {
    deferred.reject({ message: 'invalid authorization header' });
  } else {
    jwt.verify(auth.token, process.env.APP_SECRET, function (err, decoded) {
      if (err) {
        deferred.reject({ message: 'invalid authorization header' });
      } else {
        deferred.resolve({ message: 'verified' });
      }
    });
  }

  return deferred.promise;
}

/**
 * Decodes the token according to the API type
 * 
 * @param {string} authorization - Authorization header of the request
 * @param {string} api - API type 
 * @returns {object} - Token or object containing a message
 */
module.exports.decode = function (authorization, api) {
  var auth = authHeader.parse(authorization);
  if (checkScheme(api) == '' || auth.scheme != checkScheme(api)) {
    return { message: 'invalid token' };
  } else {
    return jwt.decode(auth.token);
  }
}

/**
 * Checks the scheme for each API type
 * 
 * @param {string} api - API type 
 * @returns {string} - Scheme
 */
function checkScheme(api) {
  if (api === 'chat') {
    return process.env.JWT_API_SCHEME;
  } else if (api === 'socket') {
    return process.env.JWT_SOCKET_SCHEME;
  } else {
    return '';
  }
}