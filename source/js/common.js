/*
	API URL: http://www.omdbapi.com/

	Firebase: https://qmoviesapp.firebaseio.com/
*/

function mainController($http, $scope, $firebaseArray) {
    if (DEBUG) {
        console.log('[Main Ctrl] Init...');
    }

	var ref = new Firebase('https://qmoviesapp.firebaseio.com/');

	$scope.myMovies = $firebaseArray(ref);

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

	$scope.customSort = '';
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
