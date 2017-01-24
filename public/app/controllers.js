angular.module('RecipeCtrls', ['RecipeServices'])
.controller('HomeCtrl', ['$scope', 'Recipe', function($scope, Recipe) {
  $scope.recipes = [];

  Recipe.query(function success(data) {
    $scope.recipes = data;
  }, function error(data) {
    console.log(data);
  });

  $scope.deleteRecipe = function(id, recipesIdx) {
    Recipe.delete({ id: id }, function success(data) {
      $scope.recipes.splice(recipesIdx, 1);
    }, function error(data) {
      console.log(data);
    });
  };
}])
.controller('ShowCtrl', ['$scope', '$stateParams', 'Recipe', function($scope, $stateParams, Recipe) {
  $scope.recipe = {};

  Recipe.get({ id: $stateParams.id }, function success(data) {
    $scope.recipe = data;
  }, function error(data) {
    console.log(data);
  });
}])
.controller('NewCtrl', ['$scope', '$location', 'Recipe', function($scope, $location, Recipe) {
  $scope.recipe = {
    title: '',
    description: '',
    image: ''
  };

  $scope.createRecipe = function() {
    Recipe.save($scope.recipe, function success(data) {
      $location.path('/');
    }, function error(data) {
      console.log(data);
    });
  };
}])
.controller('NavCtrl', ['$scope', '$state', 'Auth', 
    function($scope, $state, Auth) {
  $scope.isLoggedIn = function() {
    return Auth.isLoggedIn()
  };

  $scope.logout = function() {
    Auth.removeToken();
    $state.go('login');
  };
}])
.controller('SignupCtrl', ['$scope', '$state', 'UserService', 
    function($scope, $state, UserService) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userSignup = function() {
    // to implement
    var params = {
      email: $scope.user.email,
      password: $scope.user.password
    }
    UserService.createAccount(params).then(function(user) {
      if (user === false) {
        console.log("user create error");
      } else {
        console.log("got user:", user);
        $state.go('home'); // redirect to homepage upon successful signup
        // $location.path = '/';

        // more complex example of state.go:
        // $state.go('profile', {user: 12121, date_lt: '2008'});
      }
    });
  };
}])
.controller('LoginCtrl', ['$scope', 'UserService', '$state', 
    function($scope, UserService, $state) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userLogin = function() {
    UserService.login($scope.user).then(function(user) {
      console.log("login response:", user);
      if (user !== false) {
        $state.go('home');
      }
    });
  };
}]);
