(function() {
  'use strict';

  app.factory('authService', authService);

  authService.$inject = ['$http', '$localStorage', 'apiService', 'userService'];

  function authService($http, $localStorage, apiService, userService) {
    var service = {};

    service.Login = Login;
    service.Logout = Logout;

    return service;

    function Login(username, password, callback) {
      var credentials = {
        username: username,
        password: password
      }
      var params = {
        type: 'api/login',
        requestType: 'POST',
        data: credentials
      }
      apiService.gatewayCall(params).then(function(response) {
        // login successful if there's a token in the response
        if (response.data.token) {
          // store username and token in local storage to keep user logged in between page refreshes
          $localStorage.User = { "username": response.data.user.username, "token": response.data.token };

          // add jwt token to auth header for all requests made by the $http service
          $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;

          userService.setToken(response.data.token);
          userService.updateUser(response.data.user);

          // execute callback with true to indicate successful login
          callback(true);
        } else {
          // execute callback with false to indicate failed login
          callback(false);
        }
      }, function() { // on error!
        callback(false);
      });
    }

    function Logout() {
      // remove user from local storage and clear http auth header
      delete $localStorage.User;
      $http.defaults.headers.common.Authorization = '';
    }
  }
})();