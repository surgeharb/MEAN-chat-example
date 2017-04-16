app.controller('LoginController', ['$scope', '$location', 'authService', function($scope, $location, authService) {

  $scope.login = function() {
    authService.Login($scope.username, $scope.password, function(result) {
      if (result) {
        $location.path('/');
      } else {
        $scope.error = 'Your username or password is incorrect';
        $scope.loading = false;
      }
    });
  }

}])