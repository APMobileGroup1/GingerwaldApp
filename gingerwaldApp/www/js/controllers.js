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

.controller('LoginCtrl', function ($scope, $http, $rootScope, loginSrv, $state, $ionicViewSwitcher) {

  // Function to set the Sweet-Alert confirm button to the green Gingerwald color
  swal.setDefaults({
    confirmButtonColor: '#8DAC52'
  });

  $scope.data = {};
  $scope.login = function () {
    loginSrv.doLogin($scope.data.username, $scope.data.password).then(function (data) {
        console.log(data);
        $rootScope.userToken = data.access_token;
        $state.go('app.main');
      })
      .catch(function (e) {
        $scope.data.password = "";
        if (e.responseJSON.error_description == "Missing input parameters") {
          swal("Fout", "Je hebt een of meerdere inlogvelden niet ingevuld.", "warning");
        } else if (e.responseJSON.error_description == "Authorization failed") {
          swal("Fout", "Deze inloggegevens kloppen niet. Probeer opnieuw.", "error");
        } else {
          swal("Fout", "Er is een of andere rare fout opgedoken: " + e.responseJSON.error_description, "error");
        }
      });
  }
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
    $scope.JuiceImg = "https://gingerwald.com/community/v2.1/api/getJuicePicture.php?token=" + $rootScope.userToken + "&juice_id=" + data.JuiceID;

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

.controller("DoughnutCtrl", function ($scope, graphSrv, ionicDatePicker) {

  var datePickerUpdate = function () {
    graphSrv.getUserStats($scope.fromDatepickerObject.inputDate, $scope.toDatepickerObject.inputDate).then(function (data) {
      console.log(data);

      // Get Ingredients
      var labels = [];
      var amounts = [];
      console.log(data.Ingredients.length);
      for (var i = 0; i < data.Ingredients.length; i++) {
        labels.push(data.Ingredients[i].Ingredient.Name);
        amounts.push(data.Ingredients[i].Ingredient.Amount_g)
      }
      $scope.labelsIngredients = labels;
      $scope.dataIngredients = amounts;


      // Get Nutrients
      var labels = [];
      var amounts = [];
      console.log(data.Nutrients.length);
      for (var i = 0; i < data.Nutrients.length; i++) {
        labels.push(data.Nutrients[i].Nutrient.Name);
        amounts.push(data.Nutrients[i].Nutrient.Amount_g)
      }
      $scope.labelsNutrients = labels;
      $scope.dataNutrients = amounts;
    })
  };
  
  
  $scope.showAll = function () {
    $scope.fromDatepickerObject.inputDate = new Date(1970,00,01);
    $scope.toDatepickerObject.inputDate = new Date();
    datePickerUpdate();
  };
  

  // From Datepicker
  $scope.fromDatepickerObject = {
    inputDate: new Date(), //Optional
    callback: function (val) { //Mandatory
      fromDatePickerCallback(val);
    }
  };

  var fromDatePickerCallback = function (val) {
    if (typeof (val) === 'undefined') {
      console.log('No date selected');
    } else {
      console.log('Selected date is : ', val)
      $scope.fromDatepickerObject.inputDate = new Date(val);
      datePickerUpdate();
    }
  };

  $scope.fromOpenDatePicker = function () {
    ionicDatePicker.openDatePicker($scope.fromDatepickerObject);
  }


  // To Datepicker
  $scope.toDatepickerObject = {
    inputDate: new Date(), //Optional
    callback: function (val) { //Mandatory
      toDatePickerCallback(val);
    }
  };

  $scope.toOpenDatePicker = function () {
    ionicDatePicker.openDatePicker($scope.toDatepickerObject);
  }

  var toDatePickerCallback = function (val) {
    if (typeof (val) === 'undefined') {
      console.log('No date selected');
    } else {
      console.log('Selected date is : ', val)
      $scope.toDatepickerObject.inputDate = new Date(val);
      datePickerUpdate();
    }
  };

  datePickerUpdate();

})