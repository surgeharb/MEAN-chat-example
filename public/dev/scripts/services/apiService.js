(function() {
  'use strict';

  app.service('apiService', apiService);

  apiService.$inject = ['$q', '$http'];

  function apiService($q, $http) {
    this.gatewayCall = gatewayCall;

    function gatewayCall(params) {
      var data = params.data;
      var deferred = $q.defer();
      $http({
        url: '/' + params.type,
        data: data,
        method: params.requestType,
      }).then(function(data, status, headers, config) { //success
        deferred.resolve(data);
      }, function(error, status) { //error
        deferred.reject();
      });

      return deferred.promise;
    };
  };

})();