(function() {
  'use strict';

  app.service('userService', userService);

  function userService() {
    var user = {};
    var token = '';

    var updateUser = function(userObject) {
      user = userObject;
    }

    var getUser = function() {
      return user;
    }

    var setToken = function(userToken) {
      token = userToken;
    }

    var getToken = function() {
      return token;
    }

    return {
      updateUser: updateUser,
      getUser: getUser,
      setToken: setToken,
      getToken: getToken
    };

  }
})();