angular.module('gingerwald.controllers', ['ionic', 'ngCordova'])

.controller('AppCtrl', function ($scope, $http, $rootScope, $state, $ionicModal, $timeout, $cordovaBarcodeScanner, $location) {

  // REMOVE THIS CODE IF YOU WANT TO SCAN A BOTTLE ON A REAL DEVICE
  $rootScope.scannedCode = 'py6FkeikVFQGXb';

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.notyet = function () {
    swal("Oeps!", "Hier is nog niets te vinden. We zijn hard aan het werken op deze functie. Sit tight!", "warning");
  }

  $scope.scanBarcode = function () {
    var regex1 = /http:\/\/qr.gingerwald.com\?b=/;
    var regex2 = /[^=]*$/;
    
    $cordovaBarcodeScanner.scan({
      "showFlipCameraButton": true,
      "showTorchButton": true,
      "formats": "QR_CODE"
    }).then(function (imageData) {
      if (regex1.test(imageData.text)) {
        $rootScope.scannedCode = regex2.exec(imageData.text)[0];
        $state.go('app.scan-a-l');
      } else {
        $scope.scannedCode = "Dit is geen QR-Code van een Gingerwald flesje!";
      }
    }, function (error) {
      console.log("An error happened -> " + error);
    });
  };


})

.controller('MainCtrl', function ($scope, $http, $rootScope, mainSrv) {
  mainSrv.getMainInfo().then(function (data) {
    $scope.LoginKey = data.Login;
    $scope.Credits = data.NumberCredits
  })
})

.controller("QrCodeScanner", function ($scope, bottleSrv, juiceSrv, dashSrv, $http, $rootScope, $cordovaBarcodeScanner, $state, $ionicScrollDelegate) {
  bottleSrv.getBottleDetails($rootScope.scannedCode).then(function (data) {
    $scope.JuiceID = data.JuiceID;
    $scope.ExpirationDate = data.ExpirationDate;
    $scope.JuiceImg = "https://gingerwald.com/community/v2.1/api/getJuicePicture.php?token=RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu&juice_id=" + data.JuiceID;

    juiceSrv.getJuiceDetails($scope.JuiceID).then(function (data) {
      $scope.JuiceName = data.Name;
      $scope.JuiceDescription = data.Description;
    })

    juiceSrv.getJuiceIngredients($scope.JuiceID).then(function (data) {
      $scope.JuiceIngredients = data;
    })

    juiceSrv.getJuiceNutrients($scope.JuiceID).then(function (data) {
      $scope.JuiceNutrients = data;
    })
  });

  $scope.addToDash = function () {
    dashSrv.addToDash($rootScope.scannedCode).then(function (info) {
        $state.go('app.scan-b');
      })
      .catch(function (e) {
        if (e.error_description == "Bottle has already been appointed") {
          swal("Oeps!", "Dit flesje is al eens toegevoegd aan een dashboard!", "warning");
        }
      });
  };

  $scope.test = function () {
    console.log("Test uitgevoerd");
    $ionicScrollDelegate.scrollTop();
    $ionicScrollDelegate.resize();
  }
})

.controller("DoughnutCtrl", function ($scope) {
  $scope.labels = ["Wortelen", "Spruiten", "Spinazie"];
  $scope.data = [300, 500, 100];
})