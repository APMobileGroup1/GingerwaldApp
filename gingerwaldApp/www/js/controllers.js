angular.module('gingerwald.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.info = function(){

    swal("Oeps!", "Hier is nog niets te vinden. We zijn hard aan het werken op deze functie. Sit tight!", "warning");
  }
  
})

.controller('MainCtrl', function($scope, $http, $rootScope){
  $rootScope.token = "RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu"; $http.jsonp('https://www.gingerwald.com/community/v2.1/api/getUserDetails.php?token=' + $rootScope.token + '&callback=JSON_CALLBACK').success(function(data){
    $scope.key = data.Login;
  })
})