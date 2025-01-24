var app1 = angular.module("movieApp", []);
app1.controller('dashboardController', ['$scope', '$http', '$window','$sce', function($scope, $http, $window,$sce) {
  $scope.movies = [];
  $scope.filteredMovies = [];
  $scope.watchlist = []; // Array to store movies in the watchlist
  $scope.isWatchlistOpen = false; // State to manage watchlist modal visibility
  $scope.searchQuery = ''; // Default search query for the example
  $scope.loading = true;
  $scope.errorMessage = '';

  const API_KEY = 'c82153085ae4215963f520dcb3a816f3';
  const API_URL = 'https://api.themoviedb.org/3';
  

  
  $scope.trustedTrailerUrl = ''; // To store the trusted URL
  $scope.isTrailerModalOpen = false; // To track modal visibility

  $scope.playTrailer = function (movieId) {
  const url = `${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;

  $http.get(url).then(function (response) {
    if (response.data.results && response.data.results.length > 0) {
      const trailer = response.data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        const videoUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        $scope.trustedTrailerUrl = $sce.trustAsResourceUrl(videoUrl); // Trust the URL
        $scope.isTrailerModalOpen = true; // Show the side modal
      } else {
        alert("Trailer not found.");
      }
    } else {
      alert("Trailer not found.");
    }
  }).catch(function (error) {
    console.error("Error fetching trailer:", error);
    alert("Error fetching trailer. Please try again later.");
  });
};

$scope.closeTrailerModal = function () {
  $scope.isTrailerModalOpen = false; // Close the side modal
  $scope.trustedTrailerUrl = ""; // Clear the URL
};
$scope.showInfo = function(movie) {
  localStorage.setItem('selectedMovie', JSON.stringify(movie));
  localStorage.setItem('previousPage', 'search');
  window.location.href = 'movie-info.html';
};



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

  // Initialize watchlist from localStorage
const storedWatchlist = localStorage.getItem('watchlist');
$scope.watchlist = storedWatchlist ? JSON.parse(storedWatchlist) : [];


  
  // Function to add movie to the watchlist
$scope.addToWatchlist = function(movie) {
  if (!$scope.watchlist.some(item => item.id === movie.id)) {
    $scope.watchlist.push(movie); // Add to watchlist if not already present
    localStorage.setItem('watchlist', JSON.stringify($scope.watchlist)); // Save to localStorage
    alert(`"${movie.l}" has been added to your watchlist!`);
  } else {
    alert(`"${movie.l}" is already in your watchlist.`);
  }
};

// Function to remove movie from the watchlist
$scope.removeFromWatchlist = function(movie) {
  const index = $scope.watchlist.findIndex(item => item.id === movie.id);
  if (index !== -1) {
    $scope.watchlist.splice(index, 1); // Remove the movie from the watchlist
    localStorage.setItem('watchlist', JSON.stringify($scope.watchlist)); // Update localStorage
    alert(`"${movie.l}" has been removed from your watchlist.`);
  }
};


  // Function to toggle watchlist visibility
  $scope.toggleWatchlist = function() {
    $scope.isWatchlistOpen = !$scope.isWatchlistOpen;
    if ($scope.isWatchlistOpen) {
      document.querySelector('.watchlist-modal').style.display = 'block';
    } else {
      document.querySelector('.watchlist-modal').style.display = 'none';
    }
  };

  // Function to display movie information
//  $scope.showInfo = function(movie) {
//   localStorage.setItem('selectedMovie', JSON.stringify(movie));
//   localStorage.setItem('previousPage', 'search'); // Store a flag indicating the user came from the search page
//   window.location.href = 'movie-info.html';
// };
$scope.showInfo = function(movie) {
  localStorage.setItem('selectedMovie', JSON.stringify(movie));
  localStorage.setItem('previousPage', 'search');
  window.location.href = 'movie-info.html';
};


  

  // Logout functionality
$scope.logout = function() {
  localStorage.removeItem('loggedInUser'); // Remove logged-in user data only
  $window.location.href = '/index/index.html'; // Redirect to the login page
};

  // Initialize by fetching movies
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
  // Add to controller
$scope.isProfileModalOpen = false; // Profile modal visibility
$scope.userProfile = {}; // Logged-in user profile details

$scope.viewProfile = function() {
  const loggedInEmail = localStorage.getItem('loggedInUser');
  console.log("Logged-in email:", loggedInEmail); // Debug email

  if (!loggedInEmail) {
    alert('No user is logged in. Please log in to view your profile.');
    return;
  }

  $http.get(`/api/profile/${loggedInEmail}`)
    .then(response => {
      console.log("Profile fetched successfully:", response.data); // Debug response
      $scope.userProfile = response.data; // Set user data to scope
      $scope.isProfileModalOpen = true; // Open modal
    })
    .catch(error => {
      console.error("Error fetching profile details:", error); // Log error
      alert('Error fetching profile details. Please try again later.');
    });
};



// Function to close profile modal
$scope.closeProfileModal = function() {
  $scope.isProfileModalOpen = false;
};




}]);
