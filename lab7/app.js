var express = require('express');
var path = require('path');
var json2csv = require('json2csv');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var app = express();
var js2xmlparser = require('js2xmlparser');
var query;
var database;
var count = 0;
var results = [];
var fs = require('fs');
//connect to url 
var url = 'mongodb://localhost:27017/Lab7';
//use url in connection to mongo server 
MongoClient.connect(url, function(err, db){
	console.log("Mongo connected");
	database = db;
});
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
	client.stream('statuses/filter', query, function(stream){
		stream.on('data', function(tweet) {
			results.push(tweet);
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
//export tweets into JSON/CSV
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
	var JSONfileName = 'valenc2-websci-lab7-tweets.json';
	var CSVfileName = 'valenc2-websci-lab7-tweets.csv';
	var JSONexists = false;
	var CSVexists = false;
	//check to see if export type is JSON
	if(req.query.export=='1'){
		//check to see if file exists 
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
			  		res.send({data : [results], exists : JSONexists});
			  		console.log("tweets returned");
				}
				else{
					//add a comma in between tweets in json file 
					writeStream.write(',');
				}
			});
			//if error within stream - tell me why!
			stream.on('error', function(error) {
		    	throw error;
	 		});
		});
	}
	//if csv by default
	else{
		fs.stat(CSVfileName, function(err, stat){
			//check to see if file exists 
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

//build a mongodb 
app.get('/buildTweets', function(req, res){
	var Twitter = require('twitter');
	var collection;
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
	//we can still query specific sets for the database and get a specific number of results
	if(req.query.count == undefined){
		req.query.count = 10;
	}
	//look at collection name to see if a name has been entered 
	//if no name, we will used 'untitled' as the default collection
	if(req.query.dbName ==undefined){
		collection = database.collection('untitled');
	}
	else{
		collection=database.collection(req.query.dbName);
	}

	console.log("in write stream");
	client.stream('statuses/filter', query, function(stream){
		stream.on('data', function(tweet) {
			results.push(tweet);
		 	count = count + 1;
		 	//insert tweet into the mongodb collection
		 	collection.insert(tweet);
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
	console.log("collection created");
}); 

//read tweets from selected collection. tweets from collection can be queried and user can 
//choose how many to grab from collection
app.get('/readTweets', function(req, res){
	var nameFound = false;
	var names = [];
	var collectionName;
	var search;
	var collectionCount;
	//if no collection name is picked to read, we will read from default 'untiled' collection
	if(req.query.dbName==undefined){
		collectionName='untitled';
	}
	else{
		collectionName = req.query.dbName;
	}
	console.log("searching collections");
	//retrieve all the collection names in the db
	database.listCollections().toArray(function(err, collections){
		console.log(collections);
		names = collections;
		//sort through all of the collection names and see if the searched collection name was found
		for(var i = 0; i < names.length; i++) {
    		if (names[i].name == collectionName.toString()) {
        		nameFound=true;
        		break;
  		 	 }
		}	
	});
	//retrieve the number of docs in a collection to handle error if user chooses to 
	//enter larger number than that of which exist
	database.collection(collectionName.toString()).find().count(function(err, colCount){
		collectionCount = colCount;
	});

	if(req.query.count==undefined || isNaN(req.query.count)){
		count = 10;
	}
	else if(req.query.count>collectionCount){
		count = collectionCount;
	}
	else{
		count = parseInt(req.query.count);
	}
	//two different querys to database based on the search
	//if no search, leave out search field
	//** this did not wind up working - I would have to have parsed the entire text field inot a JSON or array and 
	//** searched through it - however I kept it up because I would like to revisit later
	if(req.query.search==undefined){
		database.collection(collectionName.toString()).find().limit(count).toArray(function(err, docs){
			res.send({data : docs, exists : nameFound});
		});
	}
	//if a serch is entered- search text field 
	else{
		search = req.query.search;
		database.collection(collectionName.toString()).find({"text": /search/}).limit(count).toArray(function(err, docs){
			res.send({data : docs, exists : nameFound});
		});
	}
	
});

//export read in tweets from database to xml file
app.get('/xmlTweets', function(req, res){
	var nameFound = false;
	var names = [];
	var collectionName;
	var search;
	var collectionCount;
	var xmlTweets;

	//if no specific collection was chosen to read/export from, we use default 'untitled' db
	if(req.query.dbName==undefined){
		collectionName='untitled';
	}
	else{
		collectionName = req.query.dbName;
	}
	//again, check to see if collection name exists within database
	console.log("searching collections");
	database.listCollections().toArray(function(err, collections){
		names = collections;
		for(var i = 0; i < names.length; i++) {
    		if (names[i].name == collectionName.toString()) {
        		nameFound=true;
        		break;
  		 	 }
		}	
	});
	//retrieve the number of docs in a collection to handle error if user chooses to 
	//enter larger number than that of which exist
	database.collection(collectionName.toString()).find().count(function(err, colCount){
		collectionCount = colCount;
	});
	if(req.query.count==undefined || isNaN(req.query.count)){
		count = 10;
	}
	else if(req.query.count>collectionCount){
		count = collectionCount;
	}
	else{
		count = parseInt(req.query.count);
	}
	//create xml file name based on input
	var xmlFileName = req.query.xmlName + '.xml';
	var XMLexists = false;
	//check for file's previous existance
	fs.stat(xmlFileName, function(err, stat){
		if(err==null){
			console.log('File exists');
			XMLexists = true;
		}
		else{
			XMLexists = false; 
		}
	});
	//again two different queries based on search parameters
	//** this did not wind up working - I would have to have parsed the entire text field inot a JSON or array and 
	//** searched through it - however I kept it up because I would like to revisit later
	if(req.query.search==undefined){
		database.collection(collectionName.toString()).find().limit(count).toArray(function(err, docs){
			res.send({data : docs, nameExists : nameFound, fileExists: XMLexists});
			xmlTweets = js2xmlparser("tweet",(JSON.stringify(docs)));
			fs.writeFile(xmlFileName, xmlTweets, function(err){
				if (err){
					throw error;
				} 
				console.log('file saved');
			});
		});
	}
	else{
		search = req.query.search;
		database.collection(collectionName.toString()).find({"text": /search/}).limit(count).toArray(function(err, docs){
			res.send({data : docs, nameExists : nameFound, fileExists: XMLexists});
			xmlTweets = js2xmlparser("tweet",(JSON.stringify(docs)));
			fs.writeFile(xmlFileName, xmlTweets, function(err){
				if (err){
					throw error;
				} 
				console.log('file saved');
			});
		});
	}
	
});

app.listen(3000, "127.0.0.1");
