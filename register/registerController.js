// registerController.js
app.controller('register', ['$scope', '$http','$location', function($scope, $http,$location) {
  $scope.id = '';
  $scope.email = '';
  $scope.pass = '';

  $scope.registerfun = function() {
    const obj = {
      id: $scope.id,
      email: $scope.email,
      pass: $scope.pass
    };

    $http.post('http://localhost:3000/api/register', obj)
      .then(function(response) {
        alert(response.data.message);
        if(response.data.message= "Sign in successful"){
          $location.path('/signin');
        }
      })
      .catch(function(error) {
        alert(error.data.message || 'An error occurred');
      });
  };
}]);
