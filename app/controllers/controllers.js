

var query = null;


angular.module('app.controllers').controller('SearchBarController', ['$scope','$location','$routeParams',
  function ($scope,$location,$routeParams) {
    $scope.query = '';
    $scope.search = function(){

          $location.path('/search/'+$scope.query);

    };
  }])

.controller('MenuController', ['$scope','$location','$routeParams',
  function ($scope,$location,$routeParams) {
    $scope.pindex = 0;

  //  '/dashboard/latest/all'
  }]);
