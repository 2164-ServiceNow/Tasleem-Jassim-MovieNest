var app = angular.module("demo", ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: "/signIn/signin.html",
      controller: "signin"
    })
    .when('/register', {
      templateUrl: "/register/register.html",
      controller: "register"
    })
    .when('/dashboard', {
      templateUrl: "/movieDashboard/dashboard.html",
      controller: "dashboardController"
    })
    .when('/signin', {
      templateUrl: '/signIn/signin.html',
      controller: 'signinController'
    })
    .otherwise({
      redirectTo: "/signin"
    });
});
