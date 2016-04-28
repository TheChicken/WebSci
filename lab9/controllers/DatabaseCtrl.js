angular.module('mainApp');

app.controller('DatabaseCtrl', ['$scope', '$http', function($scope, $http){

	$scope.buildButton="Build";
	$scope.query;
	//build the collection in mongodb
	$scope.buildTweets=function(){

		$http.get('/checkConnection', {}
		).then(function (response){
		
			console.log(response.data.isConnected);

			if(!response.data.isConnected){
				$scope.showWarningAlert = true;
				$scope.warningStatus = "Error!";
				$scope.warningTextAlert = "You are not connected to a database! Please go to Install page to connect.";
				$scope.switchBool = function(value){
					$scope[value] = !$scope[value];
				};
			}
			else{
				$http.get('/buildTweets', {
					params: {"count": $scope.count, "search": $scope.query, "dbName": $scope.dbName}
				}).then(function (response){
					//this callback will be called asynchronously when response is available 
					console.log("Got it");
					console.log(response.data);
					$scope.tweets=response.data;
					$scope.showSuccessAlert = true;
					$scope.successStatus = "Success!";
					$scope.successTextAlert = "Your collection was created!";
					$scope.switchBool = function(value){
						$scope[value] = !$scope[value];
					};

				}, function errorCallback(response){
					//called asychronously if error occurs or server response with error status
				});
					
			}
		});
	}; 
 }]);