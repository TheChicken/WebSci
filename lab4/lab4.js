
var app = angular.module('twitterApp', []);

app.controller('TwitterController', ['$scope', '$http', function($scope, $http) {

$scope.button="Search";

$scope.getTweets=function(){

	var q=$scope.query;

	$http.get('get_tweets.php', {

		params: {"q":q}

	}).then(function (response){
		//this callback will be called asynchronously when response is available 
		console.log(response);
		var tweets = [];

		$.each(response.data.statuses, function(i, obj){
			//$scope.image = obj.user.profile_image_url;
			tweets.push(obj);
		})



		$scope.tweets=tweets;

	}, function errorCallback(response){
		//called asychronously if error occurs or server response with error status
	});
}
}]);

