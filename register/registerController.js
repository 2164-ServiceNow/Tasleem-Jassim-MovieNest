app.controller('register', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.id = '';
  $scope.email = '';
  $scope.pass = '';
  $scope.passwordStrength = 0;
  $scope.progressColor = 'red';
  $scope.passwordHint = '';
  $scope.passwordMessages = [
    { text: 'At least one uppercase letter', isValid: false },
    { text: 'At least one lowercase letter', isValid: false },
    { text: 'At least one number', isValid: false },
    { text: 'At least 4 characters', isValid: false }
  ];

  // Password Strength Checker
  $scope.checkPasswordStrength = function (password) {
    const regexUpperCase = /[A-Z]/;
    const regexLowerCase = /[a-z]/;
    const regexNumber = /[0-9]/;
    const regexMinLength = /.{4,}/;

    let strength = 0;

    // Validate each constraint
    $scope.passwordMessages[0].isValid = regexUpperCase.test(password);
    $scope.passwordMessages[1].isValid = regexLowerCase.test(password);
    $scope.passwordMessages[2].isValid = regexNumber.test(password);
    $scope.passwordMessages[3].isValid = regexMinLength.test(password);

    // Increment strength based on validations
    if ($scope.passwordMessages[0].isValid) strength += 25;
    if ($scope.passwordMessages[1].isValid) strength += 25;
    if ($scope.passwordMessages[2].isValid) strength += 25;
    if ($scope.passwordMessages[3].isValid) strength += 25;

    // Update strength, color, and message
    $scope.passwordStrength = strength;
    if (strength === 100) {
      $scope.progressColor = 'green';
      $scope.passwordHint = 'Password is strong! Success.';
    } else if (strength >= 50) {
      $scope.progressColor = 'yellow';
      $scope.passwordHint = 'Password is moderate. Complete remaining constraints.';
    } else {
      $scope.progressColor = 'red';
      $scope.passwordHint = 'Password is weak. Complete more constraints.';
    }
  };

  // Registration Functionality
  $scope.registerfun = function () {
    const obj = {
      id: $scope.id,
      email: $scope.email,
      pass: $scope.pass
    };

    $http.post('http://localhost:3000/api/register', obj)
      .then(function (response) {
        alert(response.data.message);
        if (response.data.message === "Registration successful") {
          $location.path('/signin');
        }
      })
      .catch(function (error) {
        alert(error.data.message || 'An error occurred');
      });
  };
}]);
