
var app = angular.module('chat', ['ngRoute', 'ngSanitize']);
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/:username', {
            templateUrl: 'views/chat/chat.html',
            controller: 'ChatController',
            title: 'Chat'
        })
        .otherwise({
            redirectTo: '/404/'
        });
}])

app.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

        if (current.hasOwnProperty('$$route')) {

            $rootScope.title = current.$$route.title;
        }
    });
}]);

app.controller('MainCtrl', ['$scope', function ($scope) {
    
}]);
