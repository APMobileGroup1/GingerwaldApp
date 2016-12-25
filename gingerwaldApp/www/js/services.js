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

.service("bottleSrv", ['$http', '$q', function ($http, $q) {

  return {
    getBottleDetails: function (scannedCode) {
      var q = $q.defer();
      $http.get('https://www.gingerwald.com/community/v2.1/api/getBottleDetails.php?token=RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu&bottle_token=' + scannedCode).
      success(function (data, status, headers, config) {
        q.resolve(data.Bottle);
      });
      return q.promise;
    }
  }
}])


.service("juiceSrv", ['$http', '$q', function ($http, $q) {

  return {
    getJuiceDetails: function (juiceID) {
      var q = $q.defer();
      $http.get('https://www.gingerwald.com/community/v2.1/api/getJuiceDetails.php?token=RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu&juice_id=' + juiceID).
      success(function (data, status, headers, config) {
        q.resolve(data.Juice);
      });
      return q.promise;
    },
    getJuiceIngredients: function (juiceID) {
      var q = $q.defer();
      $http.get('https://www.gingerwald.com/community/v2.1/api/getJuiceIngredients.php?token=RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu&juice_id=' + juiceID).
      success(function (data, status, headers, config) {
        q.resolve(data);
      });
      return q.promise;
    },
    getJuiceNutrients: function (juiceID) {
      var q = $q.defer();
      $http.get('https://www.gingerwald.com/community/v2.1/api/getJuiceNutrients.php?token=RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu&juice_id=' + juiceID).
      success(function (data, status, headers, config) {
        q.resolve(data);
      });
      return q.promise;
    }
  }
}])



.service("dashSrv", ['$http', '$q', function ($http, $q) {

  return {
    addToDash: function (scannedCode) {
      var q = $q.defer();
      var res = $http.post('https://www.gingerwald.com/community/v2.1/api/addBottleToDashboard.php?token=RDN8suCd9Unll6zThEiXvUViJiyrGH3bqa3gE7pQdSti1S7nwk6ekzA4MrGawBmu&bottle_token=' + scannedCode);
      res.success(function (data, status, headers, config) {
        q.resolve(status);
      })
      .error(function(data, status) {
        q.reject(data);
      });
      return q.promise;
    }
  }
}])