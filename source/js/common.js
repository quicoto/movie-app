/*
	API URL: http://www.omdbapi.com/
*/

function mainController($http, $scope) {
    if (DEBUG) {
        console.log('[Main Ctrl] Init...');
    }

    var api = 'https://www.omdbapi.com/?type=movie&page=1&r=json';

	$scope.getMovies = function() {
	    $http({
	        method: 'GET',
	        url: api + '&s=' + $scope.searchTerm
	    }).then(function successCallback(response) {
			if (DEBUG) {
	        	console.log(response.data);
			}
	        $scope.movies = response.data.Search;
	    }, function errorCallback(response) {
	        if (DEBUG) {
	            console.log('[Main Ctrl] Error fetching...');
	            console.log(response);
	        }
	    });
	}
}

angular.module('moviesApp', [])
    .controller('mainCtrl', ['$http', '$scope', mainController])
	.filter('removeHTTP', function() {
	  return function(input) {
	    return input.replace('http://', '');
	  };
	});
