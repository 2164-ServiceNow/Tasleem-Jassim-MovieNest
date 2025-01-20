var app1 = angular.module("movieApp", []);
app1.controller('dashboardController', ['$scope', '$http', '$window','$sce', function($scope, $http, $window,$sce) {
  $scope.movies = [];
  $scope.filteredMovies = [];
  $scope.watchlist = []; 
  $scope.isWatchlistOpen = false; 
  $scope.searchQuery = '';
  $scope.loading = true;
  $scope.errorMessage = '';

  const API_KEY = '';
  const API_URL = '';

  
 

  $scope.searchMovies = function() {
    $scope.loading = true;
    $scope.errorMessage = '';
  
    let url;
  
    if ($scope.searchQuery && $scope.searchQuery.trim() !== '') {
      url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${$scope.searchQuery}`;
    } else {
      url = `${API_URL}/discover/movie?api_key=${API_KEY}`;
    }
  
    $http.get(url)
      .then(function(response) {
        if (response.data.results) {
          $scope.movies = response.data.results.map(movie => ({
            id: movie.id,
            l: movie.title,
            y: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
            r: movie.original_language,
            ad: movie.vote_average,
            ol: movie.original_title,
            i: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
            ticketsAvailable: Math.floor(Math.random() * 100)
          }));
          $scope.filteredMovies = $scope.movies;
        } else {
          $scope.movies = [];
          $scope.errorMessage = 'No movies found.';
        }
      }).catch(function(error) {
        console.error('Error fetching movies:', error);
        $scope.errorMessage = 'Error fetching movies. Please try again later.';
      }).finally(function() {
        $scope.loading = false;
      });
  };
  

 

  $scope.filterMovies = function() {
    $scope.filteredMovies = $scope.movies;

    if ($scope.searchYear) {
      $scope.filteredMovies = $scope.filteredMovies.filter(movie => movie.y == $scope.searchYear);
    }

    if ($scope.searchLanguage) {
      $scope.filteredMovies = $scope.filteredMovies.filter(movie => movie.r.toLowerCase().includes($scope.searchLanguage.toLowerCase()));
    }

    if ($scope.searchTickets !== undefined) {
      $scope.filteredMovies = $scope.filteredMovies.filter(movie => movie.ticketsAvailable >= $scope.searchTickets);
    }
  };

  
  

 
 $scope.showInfo = function(movie) {
  localStorage.setItem('selectedMovie', JSON.stringify(movie));
  localStorage.setItem('previousPage', 'search'); 
  window.location.href = 'movie-info.html';
};
  $scope.signIn = function(email, pass) {
    $http.post('/api/signin', { email, pass }).then(response => {
      localStorage.setItem('loggedInUser', email);
      alert(response.data.message);
      $window.location.href = '/dashboard';
    }).catch(error => {
      alert(error.data.message || 'Error signing in.');
    });
  };
  
}]);
