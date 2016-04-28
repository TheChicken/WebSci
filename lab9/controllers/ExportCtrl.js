angular.module('mainApp');

app.controller('ExportCtrl', ['$scope', '$http', function($scope, $http){

	$scope.exButton = "Export";
	$scope.query;
	$scope.data={
		repeatSelect: null,
		availableOptions: [
		{id: '1', name: 'JSON'},
		{id: '2', name: 'CSV'},
		{id: '3', name: 'XML'}
		],
	};
		
	$scope.exportTweets=function(){
		//verify if there is a type selected
		
		$http.get('/checkConnection', {}
		).then(function (response){
	
			console.log(response.data.isConnected);

			if(!response.data.isConnected){
				$scope.showErrorAlert = true;
				$scope.errorStatus = "Error!";
				$scope.errorTextAlert = "You are not connected to a database! Please go to Install page to connect.";
				$scope.switchBool = function(value){
					$scope[value] = !$scope[value];
				};
			}
			else if($scope.data.repeatSelect==null){
					$scope.showWarningAlert = true;
					$scope.warningStatus = "Error!";
					$scope.warningTextAlert = "You did not select an export type!";

					$scope.switchBool = function(value){
						$scope[value] = !$scope[value];
					};
				}

			else if($scope.fileName==null){
					$scope.showWarningAlert = true;
					$scope.warningStatus = "Error!";
					$scope.warningTextAlert = "You did not enter a file name!";

					$scope.switchBool = function(value){
						$scope[value] = !$scope[value];
					};
				}

			else{
				$http.get('/checkCollections',{
	              params: {"dbName" : $scope.dbName}
	            }).then(function (response){
	              console.log("got names");

	              console.log(response.exists);

	              if(response.exists==false){
		                $scope.showErrorAlert = true;
		                $scope.errorStatus = "Oops!";
		                $scope.errorTextAlert = "It appears that collection does not exist! Try creating one in the Database page.";
		                $scope.switchBool = function(value){
		                  $scope[value] = !$scope[value];
		                };
		              }

	             else{

	              		$http.get('/exportTweets', {
							params: {"count": $scope.count, "search": $scope.query, "export": $scope.data.repeatSelect, "fileName" : $scope.fileName, "dbName" : $scope.dbName}
						}).then(function (response){
							//this callback will be called asynchronously when response is available 
							console.log("Got it");
							console.log(response.data.data);
							$scope.tweets=response.data.data;

							if(response.data.fileExists==false){
								$scope.showSuccessAlert = true;
								$scope.successStatus = "Success!";
								$scope.successTextAlert = "Your tweets have been successfully exported to " + $scope.fileName;
							}
							else{
								$scope.showSuccessAlert = true;
								$scope.successStatus = "File Rewritten";
								$scope.successTextAlert = "Your tweets have been updated in " + $scope.fileName;
							}
							$scope.switchBool = function(value){
								$scope[value] = !$scope[value];
							};	
						});

					}
				});
			}
		});
	};
}]);