/*
	API URL: http://www.omdbapi.com/
*/

function mainController ($http, $scope) {
	if(DEBUG) { console.log('[Main Ctrl] Init...'); }

	var api = 'http://www.omdbapi.com/?s=star+wars';

	// Simple GET request example:
	$http({
	  method: 'GET',
	  url: api
	}).then(function successCallback(response) {
		console.log(response.data);
		$scope.movies = response.data.Search;
	  }, function errorCallback(response) {
		if(DEBUG) { console.log('[Main Ctrl] Error fetching...'); console.log(response); }
	  });
}

angular.module('moviesApp', [])
    .controller('mainCtrl', ['$http', '$scope', mainController]);
