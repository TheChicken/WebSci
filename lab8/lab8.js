//create the app
var app = angular.module('sparqlApp', []);
//create controller 
app.controller('SparqlController', ['$scope', '$http', function($scope, $http) {

$scope.button="Search";

$scope.data={
		repeatSelect: null,
		availableOptions: [
		{id:  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'+
			  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'+
			  'PREFIX dbo: <http://dbpedia.org/ontology/>'+
			  'PREFIX dbp: <http://dbpedia.org/property/>'+
			  'PREFIX dbr: <http://dbpedia.org/resource/>'+
			  'SELECT DISTINCT ?film_title (SAMPLE(?film_name) as ?name) (SAMPLE(?director) as ?movie_director) (SAMPLE(?actor_name) as ?actor) (SAMPLE(?film_country) as ?country) (SAMPLE(?film_info) as ?info)'+
			  'WHERE {?film_title rdf:type dbo:Film . ?film_title rdfs:label ?film_name ; dbp:starring ?film_actor . ?film_actor rdfs:label ?actor_name .'+
			  '?film_title rdfs:label ?film_name ; dbp:director ?film_director . ?film_director rdfs:label ?director .?film_title rdfs:comment ?film_info .'+
			  '?film_title dbp:country ?film_country . FILTER(langMatches(lang(?film_name),"EN") && regex(?actor_name, "George Clooney", "i") && langMatches(lang(?actor_name),"EN") && langMatches(lang(?film_info),"EN"))}'+
			  'GROUP BY ?film_title LIMIT 10 OFFSET 0',
			   name: 'Select all movies with George Clooney'},
		{id: 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'+
			  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'+
			  'PREFIX dbo: <http://dbpedia.org/ontology/>'+
			  'PREFIX dbp: <http://dbpedia.org/property/>'+
			  'PREFIX dbr: <http://dbpedia.org/resource/>'+
			  'SELECT DISTINCT ?film_title (SAMPLE(?film_name) as ?name) (SAMPLE(?director) as ?movie_director) (SAMPLE(?actor_name) as ?actor) (SAMPLE(?film_country) as ?country) (SAMPLE(?film_info) as ?info)'+
			  'WHERE {?film_title rdf:type dbo:Film . ?film_title rdfs:label ?film_name ; dbp:starring ?film_actor . ?film_actor rdfs:label ?actor_name .'+
			  '?film_title rdfs:label ?film_name ; dbp:director ?film_director . ?film_director rdfs:label ?director .?film_title rdfs:comment ?film_info .'+
			  '?film_title dbp:country ?film_country . FILTER(langMatches(lang(?film_name),"EN") && regex(?film_country, "United Kingdom", "i") && langMatches(lang(?actor_name),"EN") && langMatches(lang(?film_info),"EN"))}'+
			  'GROUP BY ?film_title LIMIT 10 OFFSET 0',
			  name: 'Movies produced in the United Kingdom'}
		],
	};

$scope.sparqlQuery=function(){

	if($scope.actor==null && $scope.country==null && $scope.director==null){
		$scope.showInfoAlert = true;
		$scope.infoStatus = "Hey There";
		$scope.infoTextAlert = "Why dont you query something next time and make all this hard work worth something!";

		$scope.switchBool = function(value){
			$scope[value] = !$scope[value];
		};
	}

    var actor = $scope.actor;
    var country = $scope.country;
    var director = $scope.director;
    var query = 'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'+
			  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>'+
			  'PREFIX dbo: <http://dbpedia.org/ontology/>'+
			  'PREFIX dbp: <http://dbpedia.org/property/>'+
			  'PREFIX dbr: <http://dbpedia.org/resource/>'+
			  'SELECT DISTINCT ?film_title (SAMPLE(?film_name) as ?name) (SAMPLE(?director) as ?movie_director) (SAMPLE(?actor_name) as ?actor) (SAMPLE(?film_country) as ?country) (SAMPLE(?film_info) as ?info)'+
			  'WHERE {?film_title rdf:type dbo:Film . ?film_title rdfs:label ?film_name ; dbp:starring ?film_actor . ?film_actor rdfs:label ?actor_name .'+
			  '?film_title rdfs:label ?film_name ; dbp:director ?film_director . ?film_director rdfs:label ?director .?film_title rdfs:comment ?film_info .'+
			  '?film_title dbp:country ?film_country . FILTER(langMatches(lang(?film_name),"EN")';

	$http.get('/queryDB', {

	params: {theQuery: query, actor: $scope.actor, country: $scope.country, director: $scope.director},


	}).then(function (response){
		//this callback will be called asynchronously when response is available 
		console.log("Got it");

		console.log(response.data.data.results.bindings);
		$scope.movies = response.data.data.results.bindings;
		//this callback will be called asynchronously when response is available 
		

	}, function errorCallback(response){
		//called asychronously if error occurs or server response with error status
	});
	}

$scope.premadeQuery=function(){

	if($scope.data.repeatSelect==null){
		$scope.showInfoAlert1 = true;
		$scope.infoStatus = "Error!";
		$scope.infoTextAlert = "You did not select a pre-made query!";

		$scope.switchBool = function(value){
			$scope[value] = !$scope[value];
		};
	}

	$http.get('/queryPremade', {

	params: {theQuery: $scope.data.repeatSelect},
	

	}).then(function (response){
		console.log(response.data.data.results.bindings);
		$scope.movies = response.data.data.results.bindings;
		//this callback will be called asynchronously when response is available 
		console.log("Got it");

	}, function errorCallback(response){
		//called asychronously if error occurs or server response with error status
	});
	}
}]);


