// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('gingerwald', ['ionic', 'gingerwald.controllers', 'gingerwald.services', 'chart.js', 'ngSanitize', 'ionic-datepicker'])

.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider, ionicDatePickerProvider) {
  $stateProvider

    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.main', {
    url: '/main',
    views: {
      'menuContent': {
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('scan-a-nl', {
    url: '/scan-a-nl',
    templateUrl: 'templates/scan-a-nl.html'
  })

  .state('app.scan-a-l', {
    url: '/scan-a-l',
    views: {
      'menuContent': {
        templateUrl: 'templates/scan-a-l.html',
        controller: 'ScanBottleCtrl'
      }
    }
  })

  .state('app.scan-b', {
    url: '/scan-b',
    views: {
      'menuContent': {
        templateUrl: 'templates/scan-b.html',
        controller: 'ScanBottleCtrl'
      }
    }
  })

  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  })

  .state('app.jotd', {
    url: '/jotd',
    views: {
      'menuContent': {
        templateUrl: 'templates/jotd.html',
        controller: 'JotdCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');


  var datePickerObj = {
    inputDate: new Date(),
    setLabel: 'Selecteer',
    todayLabel: 'Vandaag',
    closeLabel: 'Sluit',
    mondayFirst: true,
    weeksList: ["S", "M", "T", "W", "T", "F", "S"],
    monthsList: ["Jan", "Feb", "Maa", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
    templateType: 'popup',
    //from: new Date(2012, 8, 1),
    //to: new Date(2018, 8, 1),
    showTodayButton: true,
    dateFormat: 'dd-MM-yyyy',
    closeOnSelect: true,
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);

  swal.setDefaults({
    confirmButtonColor: '#8DAC52'
  });
});