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
      console.log("Ready to post!");
      /*var res = $http({
        url: 'https://www.gingerwald.com/community/v2.1/authorization/oauth/token.php',
        method: "POST",
        data: 'grant_type=password&username=plantijn001@gingerwald.be&password=gingerjuice&client_id=GingerwaldUserApp10&client_secret=50YCh15H760ssK9x78GxvhS065dj8TtWewI4GvXezo9tqAu6YwsSYY8KDsApeXMT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });*/
      /*var res = $http.jsonp('https://www.gingerwald.com/community/v2.1/authorization/oauth/token.php?grant_type=password&username=plantijn001@gingerwald.be&password=gingerjuice&client_id=GingerwaldUserApp10&client_secret=50YCh15H760ssK9x78GxvhS065dj8TtWewI4GvXezo9tqAu6YwsSYY8KDsApeXMT', {jsonpCallbackParam: 'callback'})*/
      var res = $http({
        method: 'JSONP',
        url: 'https://www.gingerwald.com/community/v2.1/authorization/oauth/token.php',
        params: {
          grant_type: 'password',
          username: 'plantijn001@gingerwald.be',
          password: 'gingerjuice',
          client_id: 'GingerwaldUserApp10',
          client_secret: '50YCh15H760ssK9x78GxvhS065dj8TtWewI4GvXezo9tqAu6YwsSYY8KDsApeXMT',
          callback: 'JSON_CALLBACK'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });
      res.success(function (data, status, headers, config) {
          q.resolve(data);
        })
        .error(function (data, status) {
          q.reject(data);
        });
      return q.promise;
    }
  }
}])