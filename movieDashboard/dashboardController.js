var app1 = angular.module("movieApp", []);
app1.controller('dashboardController', ['$scope', '$http', '$window', function($scope, $http, $window) {
  $scope.movies = [];
  $scope.filteredMovies = [];
  $scope.watchlist = []; // Array to store movies in the watchlist
  $scope.isWatchlistOpen = false; // State to manage watchlist modal visibility
  $scope.searchQuery = ''; // Default search query for the example
  $scope.loading = true;
  $scope.errorMessage = '';

  const API_KEY = '';
  const API_URL = 'https://api.themoviedb.org/3';

  
  $scope.searchMovies = function() {
    $scope.loading = true;
    $scope.errorMessage = '';
  
    let url;
  
    if ($scope.searchQuery && $scope.searchQuery.trim() !== '') {
      // If a search query is provided, use the Search API
      url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${$scope.searchQuery}`;
    } else {
      // If no search query, fetch all movies using the Discover API
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
            ticketsAvailable: Math.floor(Math.random() * 100) // Random tickets available
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
  

  // Function to search movies with filters
  $scope.searchMoviesWithFilters = function() {
    $scope.searchMovies(); // Fetch the movies first
    $scope.$watch('movies', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.filterMovies(); // Apply filters after movies are fetched
      }
    });
  };

  // Function to filter movies based on multiple criteria
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

  // Function to play trailer
  $scope.playTrailer = function(movieId) {
    const url = `${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;

    $http.get(url)
      .then(function(response) {
        if (response.data.results && response.data.results.length > 0) {
          const trailer = response.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
          if (trailer) {
            const trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
            $window.open(trailerUrl, '_blank');
          } else {
            alert('Trailer not found.');
          }
        } else {
          alert('Trailer not found.');
        }
      }).catch(function(error) {
        console.error('Error fetching trailer:', error);
        alert('Error fetching trailer. Please try again later.');
      });
  };

 
  // Function to display movie information
  $scope.showInfo = function(movie) {
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
    window.location.href = 'movie-info.html';
  };
  

  // Logout functionality
  $scope.logout = function() {
    $window.location.href = '/index/index.html'; // Update this to match the actual path
  };  

  // Initialize by fetching movies
  $scope.searchMovies();
}]);
