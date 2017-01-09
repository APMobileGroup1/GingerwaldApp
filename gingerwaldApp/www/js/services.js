angular.module('gingerwald.services', [])


.service("mainSrv", ['$http', '$q', function ($http, $q) {

  return {
    getMainInfo: function () {
      var q = $q.defer();
      $http.get('https://www.gingerwald.com/community/v2.1/api/getUserDetails.php?token=RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu').
      success(function (data, status, headers, config) {
        q.resolve(data.User);
      });
      return q.promise;
    }
  }
}])

.service("bottleSrv", ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

  return {
    getBottleDetails: function (scannedCode) {
      var q = $q.defer();
      $http.get('https://www.gingerwald.com/community/v2.1/api/getBottleDetails.php?token=' + $rootScope.userToken + '&bottle_token=' + scannedCode).
      success(function (data, status, headers, config) {
        q.resolve(data.Bottle);
      });
      return q.promise;
    }
  }
}])


.service("juiceSrv", ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

  return {
    getJuiceDetails: function (juiceID) {
      var q = $q.defer();
      $http.get('https://www.gingerwald.com/community/v2.1/api/getJuiceDetails.php?token=' + $rootScope.userToken + '&juice_id=' + juiceID).
      success(function (data, status, headers, config) {
        q.resolve(data.Juice);
      });
      return q.promise;
    },
    getJuiceIngredients: function (juiceID) {
      var q = $q.defer();
      $http.get('https://www.gingerwald.com/community/v2.1/api/getJuiceIngredients.php?token=' + $rootScope.userToken + '&juice_id=' + juiceID).
      success(function (data, status, headers, config) {
        q.resolve(data);
      });
      return q.promise;
    },
    getJuiceNutrients: function (juiceID) {
      var q = $q.defer();
      $http.get('https://www.gingerwald.com/community/v2.1/api/getJuiceNutrients.php?token=' + $rootScope.userToken + '&juice_id=' + juiceID).
      success(function (data, status, headers, config) {
        q.resolve(data);
      });
      return q.promise;
    }
  }
}])

.service("dashSrv", ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {

  return {
    addToDash: function (scannedCode) {
      var q = $q.defer();
      var res = $http.post('https://www.gingerwald.com/community/v2.1/api/addBottleToDashboard.php?token=' + $rootScope.userToken + '&bottle_token=' + scannedCode);
      res.success(function (data, status, headers, config) {
          q.resolve(status);
        })
        .error(function (data, status) {
          q.reject(data);
        });
      return q.promise;
    }
  }
}])

.service("loginSrv", ['$http', '$q', function ($http, $q) {

  return {
    doLogin: function (username, password) {
      var q = $q.defer();
      var res = $.ajax({
        url: 'https://www.gingerwald.com/community/v2.1/authorization/oauth/token.php',
        type: 'POST',
        crossDomain: true,
        data: {
          grant_type: 'password',
          username: 'plantijn010@gingerwald.be',
          password: 'gingerjuice',
          client_id: 'GingerwaldUserApp19',
          client_secret: 'epFMriZAIgVMudP9wRIxIzRvt9IXkLNIQvRD6Oqe2UYQhHc6Jef4d7TS4JJhFbBa',
          callback: 'JSON_CALLBACK'
        },
        contentType: 'application/x-www-form-urlencoded'
      });
      res.done(function (data) {
        q.resolve(data);
      });
      return q.promise;
    }
  }
}])