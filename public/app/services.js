angular.module('RecipeServices', ['ngResource'])
.factory('Recipe', ['$resource', function($resource) {
  return $resource('/api/recipes/:id');
}])
.factory('UserService', ['$http', 'Auth', function($http, Auth) {
  var URL = '/api/users';
  return {
    createAccount: function(params) {
      var req = {
        url: URL,
        method: "POST",
        data: params
      }
      return $http(req).then(function success(res) {
      	// This is when something goes wrong
        if (res.status !== 200) {
          console.log("couldn't create user:", res.data.message);
          return false;
        }
        console.log("User Create response:", res.data);
        return res.data;
      // This is when shit REALLY goes wrong (status code 500)
      }, function error(res) {
      	console.log("error response:", res);
      });
    },
    login: function(params) {
      var req = {
        url: '/api/auth', // If you enter "URL" here, the error response will give you the correct URL path
        method: 'POST',
        data: params
      }
      return $http(req).then(function(res) {
        console.log("got network:", res);
        if (res.status !== 200) {
          console.log("couldn't find user token", res.data.message);
          return false;
        }
        Auth.saveToken(res.data.token);
        return res.data.user;
      });
    }
  }
}])
// Saves token to LocalStorage, gets token, removes token, determines if a token exists in localStorage, and gets current user from token
.factory('Auth', ['$window', function($window) {
  return {
    saveToken: function(token) {
      $window.localStorage['secretrecipes-token'] = token;
    },
    getToken: function() {
      return $window.localStorage['secretrecipes-token'];
    },
    removeToken: function() {
      $window.localStorage.removeItem('secretrecipes-token');
    },
    isLoggedIn: function() {
      var token = this.getToken();
      if (token) {
        console.log("logged in");
        return true;
      } else {
        console.log("not logged in");
        return false;
      }
    },
    currentUser: function() {
      if (this.isLoggedIn()) {
        var token = this.getToken();
        try {
          // This is what token stores information in (payload):
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return payload;
        } catch(err) {
          return false;
        }
      }
    }
  }
}])
.factory('AuthInterceptor', ['Auth', function(Auth) {
  return {
    request: function(config) {
      var token = Auth.getToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
}]);