angular.module('mainApp');

app.controller('LoadCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval){

	$scope.loadButton="Load";
	var setQuery;
	var refresh = 1;

	$scope.getTweets=function(){
		$http.get('/tweets', {
			params: {"count": $scope.count, "search": $scope.query}
		}).then(function (response){
			//this callback will be called asynchronously when response is available 
			console.log("Got it");
			console.log(response.data);
			$scope.tweets=response.data;
			$scope.showSuccessAlert = true;
			$scope.successStatus = "Success!";
			$scope.successTextAlert = "Check out your tweets below!";

			$scope.switchBool = function(value){
				$scope[value] = !$scope[value];
			};
			
		}, function errorCallback(response){
			//called asychronously if error occurs or server response with error status
		});
	};
}]);