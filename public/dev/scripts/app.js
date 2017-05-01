var app = angular.module('chat', ['ngRoute', 'ngSanitize', 'ngStorage']);
app.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', {
      templateUrl: 'views/chat/chat.html',
      controller: 'ChatController',
      title: 'Chat'
    })
    .when('/login', {
      templateUrl: 'views/login/login.html',
      controller: 'LoginController',
      title: 'Login'
    })
    .otherwise({
      redirectTo: '/404'
    });

}])

app.run(['$location', '$rootScope', '$http', '$localStorage', function ($location, $rootScope, $http, $localStorage) {
  // keep user logged in after page refresh
  if ($localStorage.User) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.User.token;
    $rootScope.authToken = $localStorage.User.token;
  }

  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    if (current.hasOwnProperty('$$route')) {
      $rootScope.title = current.$$route.title;
    }
  });

  // redirect to login page if not logged in and trying to access a restricted page
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    var publicPages = ['/login', '/404'];
    var restrictedPage = publicPages.indexOf($location.path()) === -1;
    if (restrictedPage && !$localStorage.User) {
      $location.path('/login');
    }
  });

}]);

app.controller('MainCtrl', ['$scope', function ($scope) {

}]);