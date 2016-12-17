angular.module('gingerwald.controllers', ['ionic', 'ngCordova'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.info = function () {

    swal("Oeps!", "Hier is nog niets te vinden. We zijn hard aan het werken op deze functie. Sit tight!", "warning");
  }

})

.controller('MainCtrl', function ($scope, $http, $rootScope) {
  $rootScope.token = "RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu";
  $http.jsonp('https://www.gingerwald.com/community/v2.1/api/getUserDetails.php?token=' + $rootScope.token + '&callback=JSON_CALLBACK').success(function (data) {
    $scope.key = data.Login;
  })
})

.controller("QrCodeScanner", function ($scope, $cordovaBarcodeScanner) {

  var regex = /[^=]*$/;
  var regex2 = /http:\/\/qr.gingerwald.com\?b=/;

  $scope.scanBarcode = function () {
    $cordovaBarcodeScanner.scan({
      "showFlipCameraButton": true,
      "showTorchButton": true
    }).then(function (imageData) {
      console.log("Barcode Format -> " + imageData.format);
      console.log("Cancelled -> " + imageData.cancelled);
      if (regex2.test(imageData.text)) {
        $scope.scannedCode = regex.exec(imageData.text)[0];
      } else {
          $scope.scannedCode = "Dit is geen QR-Code van een Gingerwald flesje!";
      }
    }, function (error) {
      console.log("An error happened -> " + error);
    });
  };


});