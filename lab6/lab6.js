//create the app
var app = angular.module('twitterApp', []);
//create controller 
app.controller('TwitterController', ['$scope', '$http', function($scope, $http) {

	//define the button and counter
	$scope.button="Load";
	$scope.exButton = "Export"
	$scope.data={
		repeatSelect: null,
		availableOptions: [
		{id: '1', name: 'JSON'},
		{id: '2', name: 'CSV'}
		],
	};

	$scope.getTweets=function(){


		$http.get('/tweets', {

			params: {"count": $scope.count, "search": $scope.search}

		}).then(function (response){
			//this callback will be called asynchronously when response is available 
			console.log("Got it");
			
			$scope.tweets=response.data;

			$scope.showSuccessAlert = true;
			$scope.successStatus = "Success!";
			$scope.successTextAlert = "Check out your tweets below - try exporting next time!";

			$scope.switchBool = function(value){
				$scope[value] = !$scope[value];
			};

		}, function errorCallback(response){
			//called asychronously if error occurs or server response with error status
		});
	};

	$scope.exportTweets=function(){

		var count = $scope.count;
		var search= $scope.query;

		if($scope.data.repeatSelect==null){
			$scope.showSuccessAlert = true;
			$scope.successStatus = "Error!";
			$scope.successTextAlert = "You did not select an export type";

			$scope.switchBool = function(value){
				$scope[value] = !$scope[value];
			};
		}

		else{

			$http.get('/exportTweets', {

				params: {"count": $scope.count, "search": $scope.query, "export": $scope.data.repeatSelect}

			}).then(function (response){
				//this callback will be called asynchronously when response is available 
				console.log("Got it");
				console.log(response.data.data);
				$scope.tweets=response.data.data[0];

				if(response.data.exists==false){
					$scope.showSuccessAlert = true;
					$scope.successStatus = "Success!";
					$scope.successTextAlert = "Your tweets have been successfully exported";
				}
				else{
					$scope.showSuccessAlert = true;
					$scope.successStatus = "File Rewritten";
					$scope.successTextAlert = "Your tweets have been updated in the file";
				}
				
			}, function errorCallback(response){
				//called asychronously if error occurs or server response with error status
			});

		}
	};

}]);
