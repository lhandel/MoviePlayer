
var movie;
var app = angular.module('app', [
  'ngRoute',
  'app.controllers',
  'app.datastorage'
]);
angular.module('app.controllers', []);
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/dashboard/:show/:type', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController',
        title: 'Översikt'
      }).
      when('/detail', {
        templateUrl: 'views/detail.html',
        controller: 'DetailController'
      }).
      when('/favorites', {
        templateUrl: 'views/favorites.html',
        controller: 'FavoritesController'
      }).
      when('/search/:query', {
        templateUrl: 'views/search.html',
        controller: 'SearchController'
      }).
      otherwise({
        redirectTo: '/dashboard/latest/all'
      });
  }])
.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
}).filter('contains', function() {
  return function (array, needle) {
    return array.indexOf(needle) >= 0;
  };
});
