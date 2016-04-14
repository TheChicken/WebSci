//create the app
var app = angular.module('twitterApp', []);
//create controller 
app.controller('TwitterController', ['$scope', '$http', function($scope, $http) {
	//define the button and counter
	$scope.button="Load";
	var names = [];
	$scope.exButton = "Export";
	$scope.buildButton="Build";
	$scope.readButton="Read";
	$scope.xmlButton="Create XML";
	$scope.data={
		repeatSelect: null,
		availableOptions: [
		{id: '1', name: 'JSON'},
		{id: '2', name: 'CSV'}
		],
	};
	//tweet retrieval 
	$scope.getTweets=function(){
		$http.get('/tweets', {
			params: {"count": $scope.count, "search": $scope.query}
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
	//export tweets as JSON or CSV
	$scope.exportTweets=function(){
		//verify if there is a type selected
		if($scope.data.repeatSelect==null){
			$scope.showSuccessAlert1 = true;
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
				$scope.tweets1=response.data.data[0];

				if(response.data.exists==false){
					$scope.showSuccessAlert1 = true;
					$scope.successStatus = "Success!";
					$scope.successTextAlert = "Your tweets have been successfully exported";
				}
				else{
					$scope.showSuccessAlert1 = true;
					$scope.successStatus = "File Rewritten";
					$scope.successTextAlert = "Your tweets have been updated in the file";
				}
				$scope.switchBool = function(value){
					$scope[value] = !$scope[value];
				};
				
			}, function errorCallback(response){
				//called asychronously if error occurs or server response with error status
			});

		}
	};
	//build the collection in mongodb
	$scope.buildTweets=function(){

		$http.get('/buildTweets', {
			params: {"count": $scope.count, "search": $scope.query, "dbName": $scope.dbName}
		}).then(function (response){
			//this callback will be called asynchronously when response is available 
			console.log("Got it");
			$scope.tweets2=response.data;
			$scope.showSuccessAlert2 = true;
			$scope.successStatus = "Success!";
			$scope.successTextAlert = "Your database has been created!";
			$scope.switchBool = function(value){
				$scope[value] = !$scope[value];
			};

		}, function errorCallback(response){
			//called asychronously if error occurs or server response with error status
		});
	};
	//read in tweets from selected collection
	$scope.readTweets=function(){

		$http.get('/readTweets', {
			params: {"count": $scope.count, "search" : $scope.search, "dbName": $scope.dbName}
		}).then(function (response){
			//this callback will be called asynchronously when response is available 
			console.log("Got it");
			$scope.tweets2=response.data.data;

			if(response.data.exists==false){
				$scope.showSuccessAlert2=true;
				$scope.successStatus = "Error!";
				$scope.successTextAlert = "No such collection exists!";
			}
			else{
				$scope.showSuccessAlert2=true;
				$scope.successStatus = "Success!";
				$scope.successTextAlert = "Your retrieval is below!";
			}
			
			$scope.switchBool = function(value){
				$scope[value] = !$scope[value];
			};
		}, function errorCallback(response){
			//called asychronously if error occurs or server response with error status
		});
	};
	//read in tweets from selected collection and save with file name as xml
	$scope.xmlTweets=function(){

		if($scope.xmlName==null){
			$scope.showSuccessAlert2 = true;
			$scope.successStatus = "Error!";
			$scope.successTextAlert = "You did not enter a name";

			$scope.switchBool = function(value){
				$scope[value] = !$scope[value];
			};
		}
		else{

			$http.get('/xmlTweets', {
				params: {"count": $scope.count, "search" : $scope.search, "dbName": $scope.dbName, "xmlName" : $scope.xmlName}
			}).then(function (response){
				//this callback will be called asynchronously when response is available 
				console.log("Got it");
				$scope.tweets2=response.data.data;
				console.log(response.data.fileExists);
				if(response.data.fileExists==true){
					$scope.showInfoAlert=true;
					$scope.infoStatus = "File Existed!";
					$scope.infoTextAlert = "Your previous XML was rewritten!";
				}

				if(response.data.nameExists==false){
					$scope.showSuccessAlert2=true;
					$scope.successStatus = "Error!";
					$scope.successTextAlert = "No such collection exists!";
				}
				else{
					$scope.showSuccessAlert2=true;
					$scope.successStatus = "Success!";
					$scope.successTextAlert = "Your XML was created with the tweets below!";
				}
				
				$scope.switchBool = function(value){
					$scope[value] = !$scope[value];
				};
			}, function errorCallback(response){
				//called asychronously if error occurs or server response with error status
			});
		}
	};
}]);
