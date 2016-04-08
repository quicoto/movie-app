/*
	API URL: http://www.omdbapi.com/

	Firebase: https://qmoviesapp.firebaseio.com/
*/

function mainController($http, $scope, $firebaseArray) {
    if (DEBUG) {
        console.log('[Main Ctrl] Init...');
    }

	var ref = new Firebase('https://qmoviesapp.firebaseio.com/');
	$scope.limit = 4; // Initial value
	var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

	// If we're in Desktop
	if (width > 900) {
		$scope.limit = 9999;
	}

	function getMyMovies() {
		$scope.myMovies = $firebaseArray(ref.orderByChild("added").limitToLast($scope.limit));
	}

	// Initial
	getMyMovies();

	$scope.loadMore = function(howManyMore) {
		$scope.limit += parseInt(howManyMore);
		getMyMovies();
	}

	if (DEBUG) {
		console.log($scope.myMovies);
	}

	$scope.getMovies = function() {
	    $http({
	        method: 'GET',
	        url: 'https://www.omdbapi.com/?type=movie&page=1&r=json&s=' + $scope.searchTerm
	    }).then(function successCallback(response) {
			if (DEBUG) {
	        	console.log(response.data);
			}

			$scope.movies = response.data.Search;

			var maxMovies = $scope.movies.length,
				maxMyMovies = $scope.myMovies.length,
				i,
				j;

			for (i = 0; i < maxMovies; i++){
				for (j = 0; j < maxMyMovies; j++){
					if( $scope.movies[i].imdbID === $scope.myMovies[j].imdbID ){
						$scope.movies[i].seen = true;
						$scope.movies[i].myIndex = j;
					}
				}
			}


	    }, function errorCallback(response) {
	        if (DEBUG) {
	            console.log('[Main Ctrl] Error fetching...');
	            console.log(response);
	        }
	    });
	};

	$scope.markSeen = function(movie) {
		if (DEBUG) {
			console.info('Movie added');
			console.log(movie);
		}
		movie.added = new Date().getTime();
		$scope.myMovies.$add(movie);
		$scope.getMovies();
	};

	$scope.removeSeen = function(movie, myIndex, refresh) {
		if (DEBUG) {
			console.info('Movie removed');
			console.log(movie);
		}

		$scope.myMovies.$remove(myIndex);
		if( refresh === 'true' ){
			$scope.getMovies();
		}
	};

	$scope.customSort = '-added'; // The "-" means DESC
	$scope.orderResults = function(sort) {
		$scope.customSort = sort;
	}
}

angular.module('moviesApp', ["firebase"])
    .controller('mainCtrl', ['$http', '$scope', '$firebaseArray', mainController])
	.filter('removeHTTP', function() {
	  return function(input) {
	    return input.replace('http://', '');
	  };
	});
