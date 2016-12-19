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

.controller('MainCtrl', function($scope, $http, $rootScope){
    $http.get('https://www.gingerwald.com/community/v2.1/api/getUserDetails.php?token=RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu').success(function(data){
    $scope.LoginKey = data.User.Login;
    $scope.Credits = data.User.NumberCredits
  })
})

.controller("QrCodeScanner", function ($scope, $cordovaBarcodeScanner) {

  var regex = /[^=]*$/;
  var regex2 = /http:\/\/qr.gingerwald.com\?b=/;

  $scope.scanBarcode = function () {
    $cordovaBarcodeScanner.scan({
      "showFlipCameraButton": true,
      "showTorchButton": true,
      "formats" : "QR_CODE"
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

.controller("DoughnutCtrl", function ($scope) {
  $scope.labels = ["Wortelen", "Spruiten", "Spinazie"];
  $scope.data = [300, 500, 100];
});