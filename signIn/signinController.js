// signInController.js

app.controller('signin', ['$scope', '$http', '$location','$window', function($scope, $http, $location,$window) {
  $scope.email = '';
  $scope.pass = '';


  $scope.signinfun = function() {
    const obj = {
      email: $scope.email,
      pass: $scope.pass
    };
    console.log('Sending data:', obj);
  
    $http.post('http://localhost:3000/api/signin', obj)
      .then(function(response) {
        console.log('Response:', response.data.message);
        if (response.data.message === 'Sign in successful') {
          localStorage.setItem('loggedInUser', $scope.email); // Save the logged-in user's email in localStorage
          $window.open('/movieDashboard/dashboard.html', '_self');
        } else {
          alert('Unexpected response: ' + response.data.message);
        }
      })
      .catch(function(error) {
        console.error('Error details:', error); // Log full error object
        const errorMessage = (error.data && error.data.message) ? error.data.message : 
          (error.status === 404 ? 'Endpoint not found' : 'An error occurred');
        alert(errorMessage);
      });
  };
  
 
}]);
