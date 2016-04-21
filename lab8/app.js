var express = require('express');
var path = require('path');
var app = express();
var query;
var count = 0;
var results = [];
const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const endpoint = 'http://dbpedia.org/sparql';

//var sparql = require ('sparql');
//var client = new sparql.Client('http://dbpedia.org/sparql');

app.use(express.static(path.join(__dirname,'/')));

//serving the html file 
app.get('/', function(req, res, next){
	res.sendFile('index.html', {root: './'});
	next();
});

app.get('/queryDB', function(req, res){



	;

	var qryString = req.query.theQuery;
	console.log("Query to " + endpoint);

	if(req.query.actor!==undefined){
		qryString = qryString + ' && regex(?actor_name, "' + req.query.actor +'", "i")';
	}
	if(req.query.contry!==undefined){
		qryString = qryString + ' && regex(?film_country, "' + req.query.country +'" "i")';
	}
	if(req.query.director!==undefined){
		qryString = qryString + ' && regex(?directory, "' + req.query.director +'", "i")';
	}

	qryString = qryString + '&& langMatches(lang(?actor_name),"EN") && langMatches(lang(?film_info),"EN"))} GROUP BY ?film_title LIMIT 10 OFFSET 0';
	const query = qryString;
	console.log(qryString);

	var client = new SparqlClient(endpoint)
	.registerCommon('rdf', 'rdfs', 'xsd', 'fn', 'sfn');

	client.query(query)
	.execute()
	.then(function (results){
		console.log(results);
		console.log(results.s);
		res.send({data: results});
		console.log("sent results");
	})
	.catch(function (error){
		console.log("oh no");
		console.log(error);
	});
});


app.get('/queryPremade', function(req, res){

	const query = req.query.theQuery;
	console.log("Query to " + endpoint);

	var client = new SparqlClient(endpoint)
	.registerCommon('rdf', 'rdfs', 'xsd', 'fn', 'sfn');

	client.query(query)
	.execute()
	.then(function (results){
		console.log(results);
		console.log(results.s);
		res.send({data: results});
		console.log("sent results");
	})
	.catch(function (error){
		console.log("oh no");
		console.log(error);
	});
});
app.listen(3000, "127.0.0.1");



