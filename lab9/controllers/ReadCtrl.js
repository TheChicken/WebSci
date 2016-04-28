angular.module('mainApp');

app.controller('ReadCtrl', ['$scope', '$http', function($scope, $http){

  $scope.readButton="Load";
  //$scope.collectionNames;

  $scope.readTweets=function(){

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

                $http.get('/readTweets', {
                  params: {"count": $scope.count, "search" : $scope.search, "dbName": $scope.dbName}
                }).then(function (response){
                  //this callback will be called asynchronously when response is available 
                  console.log("Got it");
                  $scope.tweets=response.data.data;

                  if(response.data.exists==false){
                    $scope.showSuccessAlert=true;
                    $scope.successStatus = "Error!";
                    $scope.successTextAlert = "No such collection exists!";
                  }
                  else{
                    $scope.showSuccessAlert=true;
                    $scope.successStatus = "Success!";
                    $scope.successTextAlert = "Your retrieval is below!";
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