angular.module('starter.controllers', [])

.controller('CodesCtrl', function($rootScope, $scope, Codes) {
  $scope.search = function(searchText) {
    Codes.search(searchText).then(function(results){
      $rootScope.codes = results;
    });
  };
})

.controller('CodeDetailCtrl', function($scope, $stateParams, Codes) {
  Codes.get($stateParams.codeId).then(function(code) {
    $scope.code = code;
  });
});
