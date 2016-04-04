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

	$scope.getMovies = function() {
	    $http({
	        method: 'GET',
	        url: 'https://www.omdbapi.com/?type=movie&page=1&r=json&s=' + $scope.searchTerm
	    }).then(function successCallback(response) {
			if (DEBUG) {
	        	console.log(response.data);
			}

			// Check if I've seen the movie
			var result = $.grep(response.data.Search, function(e, index){
				if( e.imdbID === 'tt0257076' ){
					response.data.Search[index].seen = true;
				}
			});

	        $scope.movies = response.data.Search;

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
	};

	$scope.removeSeen = function(movie) {
		if (DEBUG) {
			console.info('Movie removed');
			console.log(movie);
		}
		$scope.myMovies.$remove(movie);
	};
}

angular.module('moviesApp', ["firebase"])
    .controller('mainCtrl', ['$http', '$scope', '$firebaseArray', mainController])
	.filter('removeHTTP', function() {
	  return function(input) {
	    return input.replace('http://', '');
	  };
	});
