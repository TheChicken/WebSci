var express = require('express');
var path = require('path');
var json2csv = require('json2csv');
var app = express();
var query;
var count = 0;
var results = [];
var fs = require('fs');

app.use(express.static(path.join(__dirname,'/')));

//serving the html file 
app.get('/', function(req, res, next){
	res.sendFile('index.html', {root: './'});
	next();
});

//for loading tweets
app.get('/tweets', function(req, res){

	var Twitter = require('twitter');
 
 	console.log("in twitter function");

	var client = new Twitter({
	  consumer_key: 'TBFiO8ulJOEoydWfI6xp9mHO5',
	  consumer_secret: '9JT2dlGF5DJKx7S6T1KLjN3W0R4pNfrFiDKofikzyECkKOadLF',
	  access_token_key: '403162349-0bwGhdftfORvNYNoqW83Z2yJsC8iJwnlIkFdJAVg',
	  access_token_secret: 'UFsiC8QClnaANnr3racG2v04TvFH5vQ3ocoYEqWKWQnmv'
	});

	//check in passed parameters from angular 
	if(req.query.search == undefined){
		query = {locations: '-73.68,42.72,-73.67,42.73'};
	}
	else{
		query = {track : req.query.search};
	}

	if(req.query.count == undefined){
		req.query.count = 10;
	}

	console.log("in write stream");

	console.log(query);

	client.stream('statuses/filter', query, function(stream){

		stream.on('data', function(tweet) {

			results.push(tweet);
			console.log(tweet);

		 	count = count + 1; 
		  
		  	//if the number of tweets is equal to the number requested destroy the stream
		    if(count == Number(req.query.count)){
			  	stream.destroy();
			  	res.send(results);
			  	console.log("tweets returned");
			}
		});
		stream.on('error', function(error) {
		    	throw error;
	 		});
	});
});


app.get('/exportTweets', function(req, res){

	var Twitter = require('twitter');
 
 	console.log("in twitter function");

	var client = new Twitter({
	  consumer_key: 'TBFiO8ulJOEoydWfI6xp9mHO5',
	  consumer_secret: '9JT2dlGF5DJKx7S6T1KLjN3W0R4pNfrFiDKofikzyECkKOadLF',
	  access_token_key: '403162349-0bwGhdftfORvNYNoqW83Z2yJsC8iJwnlIkFdJAVg',
	  access_token_secret: 'UFsiC8QClnaANnr3racG2v04TvFH5vQ3ocoYEqWKWQnmv'
	});

	//check in passed parameters from angular 
	if(req.query.search == undefined){
		query = {locations: '-73.68,42.72,-73.67,42.73'};
	}
	else{
		query = {track : req.query.search};
	}

	if(req.query.count == undefined || isNaN(req.query.count)){
		req.query.count = 10;
	}
	console.log("in write stream");
	//start the json file with open bracket 

	var JSONfileName = 'valenc2-websci-lab5-tweets.json';
	var CSVfileName = 'valenc2-websci-lab5-tweets.csv';
	var JSONexists = false;
	var CSVexists = false;


	if(req.query.export=='1'){

		fs.stat(JSONfileName, function(err, stat){
			if(err==null){
				console.log('File exists');
				JSONexists = true;	
			}
			else{
				JSONexists = false;
			}
		});
		var writeStream = fs.createWriteStream(JSONfileName);
		writeStream.write('[');
		//begin the streaming!! 
		client.stream('statuses/filter', query, function(stream){
			stream.on('data', function(tweet) {
			  	results.push(tweet);
		  		writeStream.write(JSON.stringify(tweet));
		    	count = count + 1; 
		  		//if the number of tweets is equal to the number requested destroy the stream
		    	if(count == Number(req.query.count)){
			  		stream.destroy();
			  		//add the closing bracket
			  		writeStream.write(']');
			  		res.send(response);
			  		console.log("tweets returned");
				}
				else{
					//add a comma in between tweets in json file 
					writeStream.write(',');
				}
			});
		});
		//if error within stream - tell me why!
		stream.on('error', function(error) {
		    throw error;
	 	});
	}

	//if csv by default
	else{
		fs.stat(CSVfileName, function(err, stat){
			if(err==null){
				console.log('File exists');
				CSVexists = true;
			}
			else{
				CSVexists = false; 
			}
		});

		client.stream('statuses/filter', query, function(stream){
			stream.on('data', function(tweet) {
				results.push(tweet);
		    	count = count + 1; 
		  		//if the number of tweets is equal to the number requested destroy the stream
		    	if(count == Number(req.query.count)){
			  		stream.destroy();
			  		res.send({data : [results], exists : CSVexists});
			  		console.log(results);
					var fields = ['created_at', 'id', 'text', 'user.id', 'user.screen_name', 'user.location', 'user.followers_count', 'user.friends_count', 'user.created_at', 'user.time_zone', 'user.profile_background_color', 'user.profile_image_url', 'geo', 'coordinates', 'place'];
					json2csv({data: results, fields: fields}, function(err, csv){
						if(err) console.log(err);
						fs.writeFile(CSVfileName, csv, function(err){
							if (err){
								throw error;
							} 
							console.log('file saved');
						});
					});	

					console.log("tweets returned");
				}

			});
			stream.on('error', function(error){
				throw error;
			});
		});
				
				
	}
});


app.listen(3000, "127.0.0.1");
