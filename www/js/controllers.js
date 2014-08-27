angular.module('starter.controllers', [])

.controller('CodesCtrl', function($rootScope, $scope, $ionicLoading, Codes) {
  $scope.search = function(searchText) {
    $scope.loading = $ionicLoading.show({ content: 'Searching' });

    Codes.search(searchText).then(function(results){
      $rootScope.codes = results;
      $scope.loading.hide();
    });
  };
})

.controller('CodeDetailCtrl', function($scope, $stateParams, $ionicLoading, Codes) {
  $scope.loading = $ionicLoading.show({ content: 'Loading' });

  Codes.get($stateParams.codeId).then(function(code) {
    $scope.code = code;
    $scope.loading.hide();
  });
});
