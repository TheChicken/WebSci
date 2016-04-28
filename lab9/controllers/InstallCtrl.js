angular.module('mainApp');

app.controller('InstallCtrl', ['$scope', '$http', function($scope, $http){

	$scope.buttonC="Connect";
	$scope.buttonDC="Disconnect";

	$http.get('/checkConnection', {}
		).then(function (response){
		
		console.log(response.data.isConnected);

		if(response.data.isConnected){
			$scope.isConnected=true;
			$scope.disconnect=false;
		}
		else{
			$scope.isConnected=false;
			$scope.disconnect=true;
		}
	});

	$scope.connectDB=function(){

		$http.get('/dbConnect', {
	    }).then(function (response){
	      console.log(response.data);

	      $scope.connectionUrl = "You are connected to : " + response.data.connectedUrl;

	      //$scope.data={
			//repeatSelect: null,
			//availableOptions: response.collNames;
			//};

	      if(response.data.isConnected){
			$scope.isConnected=true;
			$scope.disconnect=false;
			}
			else{
				$scope.isConnected=false;
				$scope.disconnect=true;
			}

		    if(response.data.isConnected==true){
				$scope.showSuccessAlert = true;
				$scope.successStatus = "Success!";
				$scope.successTextAlert = "You have successfully connected to the database";
			}
			$scope.switchBool = function(value){
				$scope[value] = !$scope[value];
			};

	    });

 	}

 	$scope.disconnectDB=function(){

 		$http.get('/dbDisconnect',{
 		}).then(function (response){

 			if(response.data.isConnected){
				$scope.isConnected=true;
				$scope.disconnect=false;
			}
			else{
				$scope.isConnected=false;
				$scope.disconnect=true;
				$scope.connectionUrl='';
			}

		    if(response.data.isConnected==false){
				$scope.showSuccessAlert = true;
				$scope.successStatus = "Success!";
				$scope.successTextAlert = "You have successfully disconnected to the database";
			}
			
			$scope.switchBool = function(value){
				$scope[value] = !$scope[value];
			};

 		});
 	}
}]);