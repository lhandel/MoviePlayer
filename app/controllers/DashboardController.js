angular.module('app.controllers').controller('DashboardController', ['$scope','$http','$location','$routeParams',
  function ($scope,$http,$location,$routeParams) {

    $scope.list = [];


    /*
     * Hämta filmer från api
     */
    var show = $routeParams.show;
    var type = $routeParams.type;
    var sort;
    var serie ='';

    if(show=='latest'){
      sort = 'time';
    }else{
      sort = 'views';
    }
    if(type=='movie'){
      serie = 'serie=0&';
    }else if(type=='serie'){
      serie = 'serie=1&';
    }
    var url = 'http://dreamfilmhd.bz/API/api.php?'+serie+'type=list&offset=0&limit=25&sort='+sort+'&climb=0';

    // Skicka requesten
    send_request(function(){
      $http({
        method: 'GET',
        url: url,
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

    // Gå till detailjerad vy
    $scope.goDetail = function(key,title){
      movie = $scope.list[key];
      console.log(movie);
      $location.path('/detail');
    }

}]);
