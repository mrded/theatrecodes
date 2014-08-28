angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Codes', function($http, $q) {
  var host = 'http://theatrecodes.co.uk';
  
  return {
    get: function(codeId) {
      var deferred = $q.defer();

      $http.get(host + '/codes/' + codeId).then(function(result) {
        return deferred.resolve(result.data);
      });

      return deferred.promise;
    },
    search: function(searchText) {
      var deferred = $q.defer();

      $http.get(host + '/codes?search=' + searchText).then(function(result) {
        return deferred.resolve(result.data);
      });

      return deferred.promise;
    }
  }
});
