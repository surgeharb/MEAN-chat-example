app.controller('LoginController', ['$scope', '$location', 'apiService', 'userService', function($scope, $location, apiService, userService) {

  $scope.login = function() {
    var params = {
      type: 'api/login',
      requestType: 'POST',
      data: {
        "username": $scope.username,
        "password": $scope.password
      }
    }
    apiService.gatewayCall(params).then(function(response) {
      $scope.token = userService.setToken(response.data.token);
      $scope.user = userService.updateUser(response.data.user);
      $location.path('/');
    });
  }

}])