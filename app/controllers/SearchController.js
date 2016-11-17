angular.module('app.controllers').controller('SearchController', ['$scope','$http','$routeParams','$location',
  function ($scope,$http,$routeParams,$location) {

    $scope.list=[];
    send_request(function(){
      $http({
        method: 'GET',
        url: 'http://dreamfilmhd.bz/API/api.php?q='+$routeParams.query+'&type=list&offset=0&limit=25&sort=views&climb=0',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
      }).success(function(data) {
          if(data.error==0){
              $scope.list = data.data;
              console.log($scope.list);
          }else{
            console.log(data);
          }
      });
    },true);

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

    
    $scope.goDetail = function(key,title){
      movie = $scope.list[key];
      $location.path('/detail');
    }

}])
