angular.module('RecipeServices', ['ngResource'])
.factory('Recipe', ['$resource', function($resource) {
  return $resource('/api/recipes/:id');
}])
.factory('UserService', ['$http', function($http) {
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
    }
  }
}]);