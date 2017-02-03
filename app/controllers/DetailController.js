angular.module('app.controllers').controller('DetailController', ['$scope','$http','$routeParams','$datastorage',
  function ($scope,$http,$routeParams,$datastorage) {

    $scope.dreamfilm = movie;
    $scope.episodes = [];
    $scope.dreamfilm.type ='movie';
    $scope.imdb = 0;


    // is fav
    $datastorage.isFavorite(movie).then(function(value){
        $scope.is_favorit = value;
        console.log($scope.is_favorit);
    });

    // Add favorites
    $scope.addFav = function(){
      $datastorage.saveFavorite(movie).then(function() {
        $scope.is_favorit = true;
      });
    }
    // Remove favorites
    $scope.removeFav = function(){
      $datastorage.removeFavorite(movie).then(function() {
        $scope.is_favorit = false;
      });
    }

    // Get movie-info from IMDB
    var imdb = require('imdb-api');
    imdb.getReq({ name: movie.title }, function(err, data) {
        console.log(data);
        if (typeof(data) !== 'undefined') {
          console.log("hittade info");
          $scope.$apply(function() {
            $scope.imdb = data;
          });
        }else{
          $scope.$apply(function() {
            $scope.imdb = -1;
          });
          console.log("kunde inte hitta film info");
        }
    });
    //.end get info from imdb


    // check if serie
    if (typeof(movie.player) == 'undefined') {
      $scope.dreamfilm.type ='serie';

      $scope.viewedEpisodes;
      $datastorage.getShowedEpisodes(movie).then(function(value){
        $scope.viewedEpisodes = value;
        console.log($scope.viewedEpisodes);
      });
      // get episodes from api
      send_request(function(){
        $http({
          method: 'GET',
          url: 'http://dreamfilmhd.bz/API/api.php?type=episodes&id='+movie.id,
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        }).success(function(data) {
            if(data.error==0){
                $scope.episodes = sort_by_season(data.data);
                console.log($scope.episodes);
                $scope.cseason = 1;
            }else{
              console.log(data);
            }
        });
      },true);
    } //.end get seriers


    // Select a season
    $scope.selectThis = function(key){
      $scope.cseason = key;
    }

    // Sorting the programs by episode
    function sort_by_season(result){
      var sorted = {};
      for(var i=0; i<result.length;i++){
        if (typeof(sorted[parseInt(result[i].season)]) == 'undefined')
          sorted[parseInt(result[i].season)] = new Array();
        sorted[parseInt(result[i].season)].push(result[i]);
      }
      return sorted;
    }

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

    // plays a movie in a new window
    $scope.play = function(url,ep_id){

      var viewInfo = {
          id: movie.id,
          episode_id: (typeof(ep_id) == 'undefined')? '' : ep_id,
      };
      $datastorage.markAsViewed(viewInfo).then(function() {
        console.log("Added!");
        if(typeof(ep_id) !== 'undefined'){
          $scope.viewedEpisodes.push(ep_id);
        }
      });
      // Send IPC to main proccess
      const {ipcRenderer} = require('electron')
      try {
          if (typeof(url) !== 'undefined') {
            ipcRenderer.send('play', {
              url: url,
              viewInfo: viewInfo
            })
          }else{
            alert('Kunde inte ladda filmen :(');
          }
      }
      catch(err) {
          alert('Kunde inte ladda filmen :(');
      }
    }




}])
