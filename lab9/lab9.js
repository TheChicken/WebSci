//create the app
var app = angular.module('mainApp', ['ngRoute']);
//create controller 
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/index', {
        templateUrl: 'pages/welcome.html',
        controller: 'WelcomeCtrl'
      }).
      when('/pages/install', {
        templateUrl: 'pages/install.html',
        controller: 'InstallCtrl'
      }).
      when('/pages/load', {
        templateUrl: 'pages/load.html',
        controller: 'LoadCtrl'
      }).
      when('/pages/export', {
        templateUrl: 'pages/export.html',
        controller: 'ExportCtrl'
      }).
      when('/pages/database', {
        templateUrl: 'pages/database.html',
        controller: 'DatabaseCtrl'
      }).
      when('/pages/read', {
        templateUrl: 'pages/read.html',
        controller: 'ReadCtrl'
      }).
      otherwise({
        redirectTo: '/index'
      });
  }]);
	


  

  

  

  






