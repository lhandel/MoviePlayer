angular.module('app.controllers').controller('FavoritesController', ['$scope','$http','$location','$datastorage',
function ($scope,$http,$location,$datastorage) {

    $scope.isEmpty=-1;
    $scope.list;
    $datastorage.getFavorites().then(function(result) {
      $scope.list = result;
      $scope.isEmpty = (result.length==0)? true : false;
      console.log(result);
    });

    /*
     * Fixar problemet med dubbla urler på vissa bilder
    */
    $scope.filterImg = function(url){
      var path = url.split('http');
      if(path.length>2){
        return 'http'+path[2];
      }else {
        return url;
      }
    };

    // Gå till detailjerad vy
    $scope.goDetail = function(key){
      movie = $scope.list[key];
      delete movie._id;
      console.log(movie);
      $location.path('/detail');
    }

}]);
