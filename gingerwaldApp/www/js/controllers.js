angular.module('gingerwald.controllers', ['ionic', 'ngCordova'])

.controller('AppCtrl', function ($scope, $http, $rootScope, $state, $timeout, $cordovaBarcodeScanner, $location) {

  // REMOVE THIS CODE IF YOU WANT TO SCAN A BOTTLE ON A REAL DEVICE
  //$rootScope.scannedCode = 'fBhHYlTbmUKNih';

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Function not yet implemented alert
  $scope.notyet = function () {
    swal("Oeps!", "Hier is nog niets te vinden. We zijn hard aan het werken op deze functie. Sit tight!", "warning");
  }

  // Cordova Scan Barcode
  $scope.scanBarcode = function () {
    var regex1 = /http:\/\/qr.gingerwald.com\?b=/;
    var regex2 = /[^=]*$/;

    $cordovaBarcodeScanner.scan({
      "showFlipCameraButton": true,
      "showTorchButton": true,
      "formats": "QR_CODE"
    }).then(function (imageData) {
      console.log(imageData);
      if (regex1.test(imageData.text)) {
        $rootScope.scannedCode = regex2.exec(imageData.text)[0];
        $state.go('app.scan-a-l');
      } else if (imageData.cancelled == 1) {
        console.log("Scanning cancelled");
      } else {
        swal("Oeps!", "Dit is geen QR-Code van een Gingerwald flesje!", "warning");
      }
    }, function (error) {
      swal("Oeps!", "Er is hier iets misgelopen! " + error, "error");
    });
  };

})

.controller('LoginCtrl', function ($scope, $http, $rootScope, loginSrv, $state, $ionicViewSwitcher) {

  $scope.data = {};
  $scope.login = function () {
    loginSrv.doLogin($scope.data.username, $scope.data.password).then(function (data) {
        console.log(data);
        $rootScope.userToken = data.access_token;
        $state.go('app.main');
        $scope.data.password = "";
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

.controller('MainCtrl', function ($scope, $http, $rootScope, mainSrv, $state) {
  mainSrv.getMainInfo().then(function (data) {
    $scope.LoginKey = data.Login;
    $scope.Credits = data.NumberCredits
  })

  $scope.goToDash = function () {
    $state.go('app.dashboard');
  }

  $scope.goToJotd = function () {
    $state.go('app.jotd');
  }

})

.controller("ScanBottleCtrl", function ($scope, bottleSrv, juiceSrv, dashSrv, $http, $rootScope, $state, $ionicScrollDelegate, $ionicHistory) {

  bottleSrv.getBottleDetails($rootScope.scannedCode).then(function (data) {
    $scope.JuiceID = data.JuiceID;
    $scope.ExpirationDate = data.ExpirationDate;
    $scope.JuiceImg = "https://gingerwald.com/community/v2.1/api/getJuicePicture.php?token=" + $rootScope.userToken + "&juice_id=" + data.JuiceID + "";
    //&image_quality=lores

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

  $scope.goToDash = function () {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.dashboard');
  }

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


.controller('JotdCtrl', function ($scope, $http, $rootScope, $ionicSlideBoxDelegate, jotdSrv, juiceSrv, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/jotd-mi.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function (modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function (index) {
    $scope.modal.show();

    var JuiceID = JuiceData[index].Juice.ID;

    $scope.JuiceImg = "https://gingerwald.com/community/v2.1/api/getJuicePicture.php?token=RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu&juice_id=" + JuiceID + "&image_quality=lores";

    juiceSrv.getJuiceDetails(JuiceID).then(function (data) {
      $scope.JuiceName = data.Name;
      $scope.JuiceDescription = data.Description;
    })

    juiceSrv.getJuiceIngredients(JuiceID).then(function (data) {
      $scope.JuiceIngredients = data;
    })

    juiceSrv.getJuiceNutrients(JuiceID).then(function (data) {
      $scope.JuiceNutrients = data;
    })
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
  };

  jotdSrv.getJotd().then(function (data) {
      JuiceData = data;
      $scope.jotd1 = data[0].Juice;
      $scope.JuiceImg1 = "https://gingerwald.com/community/v2.1/api/getJuicePicture.php?token=" + $rootScope.userToken + "&juice_id=" + data[0].Juice.ID + "&image_quality=lores";

      $scope.jotd2 = data[1].Juice;
      $scope.JuiceImg2 = "https://gingerwald.com/community/v2.1/api/getJuicePicture.php?token=" + $rootScope.userToken + "&juice_id=" + data[1].Juice.ID + "&image_quality=lores";

      $scope.jotd3 = data[2].Juice;
      $scope.JuiceImg3 = "https://gingerwald.com/community/v2.1/api/getJuicePicture.php?token=" + $rootScope.userToken + "&juice_id=" + data[2].Juice.ID + "&image_quality=lores";
    })
    .catch(function (e) {
      swal("Oeps!", "Er is iets misgelopen!", "warning");
    });

})


.controller("DashboardCtrl", function ($scope, dashSrv, ionicDatePicker, $ionicNavBarDelegate, $ionicHistory) {

  var datePickerUpdate = function () {
    dashSrv.getUserStats($scope.fromDatepickerObject.inputDate, $scope.toDatepickerObject.inputDate).then(function (data) {
      console.log(data);
      $scope.amountOfShots = data.Shots.length;

      // Get Ingredients
      var labelsI = [];
      var amountsI = [];
      console.log(data.Ingredients.length);
      for (var i = 0; i < data.Ingredients.length; i++) {
        labelsI.push(data.Ingredients[i].Ingredient.Name);
        amountsI.push(data.Ingredients[i].Ingredient.Amount_g)
      }
      $scope.labelsIngredients = labelsI;
      $scope.dataIngredients = amountsI;


      // Get Nutrients
      var labelsN = [];
      var amountsN = [];
      console.log(data.Nutrients.length);
      for (var i = 0; i < data.Nutrients.length; i++) {
        labelsN.push(data.Nutrients[i].Nutrient.Name);
        amountsN.push(data.Nutrients[i].Nutrient.Amount_g)
      }
      $scope.labelsNutrients = labelsN;
      $scope.dataNutrients = amountsN;
    })
  };


  $scope.showAll = function () {
    $scope.fromDatepickerObject.inputDate = new Date(1970, 00, 01);
    $scope.toDatepickerObject.inputDate = new Date();
    datePickerUpdate();
  };


  // From Datepicker
  $scope.fromDatepickerObject = {
    inputDate: new Date(),
    callback: function (val) {
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
    inputDate: new Date(),
    callback: function (val) {
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
