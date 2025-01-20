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

  
  $scope.trustedTrailerUrl = ''; 
  $scope.isTrailerModalOpen = false; 

  $scope.playTrailer = function(movieId) {
    const url = `${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;

    $http.get(url)
      .then(function(response) {
        if (response.data.results && response.data.results.length > 0) {
          const trailer = response.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
          if (trailer) {
            const videoUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            $scope.trustedTrailerUrl = $sce.trustAsResourceUrl(videoUrl); // Trust the URL
            $scope.isTrailerModalOpen = true;
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

  $scope.closeTrailerModal = function() {
    $scope.isTrailerModalOpen = false;
    $scope.trustedTrailerUrl = ''; // Clear the URL
  };


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

  
  $scope.addToWatchlist = function(movie) {
    if (!$scope.watchlist.some(item => item.id === movie.id)) {
      $scope.watchlist.push(movie); 
      alert(`"${movie.l}" has been added to your watchlist!`);
    } else {
      alert(`"${movie.l}" is already in your watchlist.`);
    }
  };

  $scope.removeFromWatchlist = function(movie) {
    const index = $scope.watchlist.findIndex(item => item.id === movie.id);
    if (index !== -1) {
      $scope.watchlist.splice(index, 1); 
      alert(`"${movie.l}" has been removed from your watchlist.`);
    }
  };

 
 $scope.showInfo = function(movie) {
  localStorage.setItem('selectedMovie', JSON.stringify(movie));
  localStorage.setItem('previousPage', 'search'); 
  window.location.href = 'movie-info.html';
};

  

 

  $scope.searchMovies();
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
