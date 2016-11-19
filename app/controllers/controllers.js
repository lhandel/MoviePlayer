

var query = null;


angular.module('app.controllers').controller('SearchBarController', ['$scope','$location','$routeParams',
  function ($scope,$location,$routeParams) {

    if($location.url().split('/')[1]=='search'){
      $scope.query = $routeParams.query;
    }else{
      $scope.query = '';
    }
    $scope.search = function(){
      $location.path('/search/'+$scope.query);
    };

    $scope.canGoBack = (history.length==1)? false : true;
    $scope.canGoForward = (history.length==1)? false : true;
    $scope.back = function() {
      if($scope.canGoBack)
        history.back();
    }
    $scope.forward = function () {
      history.forward();
    }

  }])

.controller('MenuController', ['$scope','$location','$routeParams',
  function ($scope,$location,$routeParams) {
    $scope.pindex = 0;

  //  '/dashboard/latest/all'
  }]);
