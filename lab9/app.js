var express = require('express');
var path = require('path');
var json2csv = require('json2csv');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var app = express();
var js2xmlparser = require('js2xmlparser');
var query;
var names = [];
var database;
var connected;
var count = 0;
var results = [];
var fs = require('fs');
var fileName = '';
var nameFound = false;
var collectionName;
var searchText = "";
var collectionCount;
var fileTweets;
//connect to url 


app.use(express.static(path.join(__dirname,'/')));
//serving the html file 
app.get('/', function(req, res, next){
	res.sendFile('index.html', {root: './'});
	next();
});

app.get('/dbConnect', function(req,res){
	var url = 'mongodb://localhost:27017/Lab9';
	//use url in connection to mongo server 
	MongoClient.connect(url, function(err, db){
		var success = 'Mongo connected';
		console.log("connected");
		console.log(url);
		console.log(success);
		database = db;
		connected = true;
		database.listCollections().toArray(function(err, collections){
			names = collections;
			console.log(names);
			res.send({connectedUrl : url, status : success, isConnected : connected, collNames : collections});
		});
	});
});

app.get('/checkConnection', function(req, res){
	if(database){
		connected = true;
		console.log(connected);
		res.send({isConnected : connected});
	}
	else{
		connected = false;
		console.log(connected);
		res.send({isConnected : connected});
	}
});

app.get('/dbDisconnect', function(req,res){
	database.close();
	connected=false;
	res.send({isConnected: connected});
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

app.get('/checkCollections', function(req, res){

	if(req.query.dbName==null){
		collectionName='untitled';
	}
	else{
		collectionName = req.query.dbName.toString();
	}
	console.log("searching collections for " + collectionName);
	//retrieve all the collection names in the db
	database.listCollections().toArray(function(err, collections){
		console.log(collections);
		names = collections;
		//sort through all of the collection names and see if the searched collection name was found
		for(var i = 0; i < names.length; i++) {
    		if (names[i].name == collectionName) {
        		nameFound=true;
        		console.log(nameFound);	
        		break;
  		 	 }
  		 	 else nameFound=false;
		}	
		console.log(nameFound + " outside");
		res.send({exists : nameFound});	
	});
});

//read tweets from selected collection. tweets from collection can be queried and user can 
//choose how many to grab from collection
app.get('/readTweets', function(req, res){
	
	//if no collection name is picked to read, we will read from default 'untiled' collection
	console.log("searching for tweets in collection");
	//retrieve all the collection names in the db
	database.listCollections().toArray(function(err, collections){
		names = collections;
		//sort through all of the collection names and see if the searched collection name was found
		for(var i = 0; i < names.length; i++) {
    		if (names[i].name == collectionName.toString()) {
        		nameFound=true;
        		break;
  		 	 }
		}	
	});

	console.log(collectionName);

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
	if(req.query.search==null){
		database.collection(collectionName.toString()).find().limit(count).toArray(function(err, docs){
			res.send({data : docs, exists : nameFound});
			console.log('no query');
		});
	}
	//if a serch is entered- search text field

	else{
		searchText = req.query.search.toString();
		database.collection(collectionName.toString()).createIndex({text : "text"});
		database.collection(collectionName.toString()).find({$text : {$search: searchText}}).limit(Number(count)).toArray(function (err, docs, callback){
			console.log("or is it here...");
			console.log(docs);
			res.send({data : docs, exists : nameFound});
		}); 
	}
	
});

//export tweets into JSON/CSV/XML
app.get('/exportTweets', function(req, res){

	console.log("searching for tweets in collection");
	//retrieve all the collection names in the db
	database.listCollections().toArray(function(err, collections){
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

	if(req.query.export=='1'){
		if(req.query.fileName==null){
			filename = 'unnamedJSON.json';
		}
		else{
			fileName = req.query.fileName + ".json";
		}
	}
	else if (req.query.export=='2'){
		if(req.query.fileName==null){
			filename = 'unnamedCSV.csv';
		}
		else{
			fileName = req.query.fileName + '.csv';
		}
	}
	else{
		if(req.query.fileName==null){
			filename = 'unnamedXML.xml';
		}
		else{
			fileName = req.query.fileName + '.xml';
		}
	} 

	var fileExists = false;
	//check for file's previous existance
	fs.stat(fileName, function(err, stat){
		if(err==null){
			console.log('File exists');
			fileExists = true;
		}
		else{
			fileExists = false; 
		}
	});

	console.log(collectionName);

	if(req.query.search==null){
		database.collection(collectionName.toString()).find().limit(count).toArray(function(err, docs){
			console.log('no query');

			if(req.query.export=='1'){
				fileTweets =("tweet",(JSON.stringify(docs, null, 3)));
				fs.writeFile(fileName, fileTweets, function(err){
					if(err){
						throw err;
					}
					console.log('file saved');
					console.log(results);
					res.send({data : docs, nameExists : nameFound, fileExists: fileExists});
					
				});
			}
			if(req.query.export=='2'){
				var fields = ['created_at', 'id', 'text', 'user.id', 'user.screen_name', 'user.location', 'user.followers_count', 'user.friends_count', 'user.created_at', 'user.time_zone', 'user.profile_background_color', 'user.profile_image_url', 'geo', 'coordinates', 'place'];
				json2csv({data: JSON.stringify(docs), fields: fields}, function(err, csv){
					
					if(err) console.log(err);
					
					fs.writeFile(fileName, csv, function(err){
						if (err){
							throw err;
						} 
						console.log('file saved');
						console.log(results);
						res.send({data : docs, nameExists : nameFound, fileExists: fileExists});
						
					});
				});
			}
			if(req.query.export=='3'){
				fileTweets = js2xmlparser("tweet", JSON.stringify(docs));
				fs.writeFile(fileName, fileTweets, function(err){
					if (err){
						throw err;
					} 
					console.log('file saved');
					console.log(results);
					res.send({data : docs, nameExists : nameFound, fileExists: fileExists});
					
				});
			}

		});
	}
	//if a serch is entered- search text field
	else{
		searchText = req.query.search.toString();
		database.collection(collectionName.toString()).createIndex({text : "text"});
		database.collection(collectionName.toString()).find({$text : {$search: searchText}}).limit(Number(count)).toArray(function (err, docs, callback){
			console.log("a query");
			console.log(docs);
			if(req.query.export=='1'){
				fileTweets =("tweet",(JSON.stringify(docs, null, 3)));
				fs.writeFile(fileName, fileTweets, function(err){
					if(err){
						throw err;
					}
					console.log('file saved');
					console.log(results);
					res.send({data : docs, nameExists : nameFound, fileExists: fileExists});
					
				});
			}
			else if(req.query.export=='2'){
				var fields = ['created_at', 'id', 'text', 'user.id', 'user.screen_name', 'user.location', 'user.followers_count', 'user.friends_count', 'user.created_at', 'user.time_zone', 'user.profile_background_color', 'user.profile_image_url', 'geo', 'coordinates', 'place'];
				json2csv({data: JSON.stringify(docs), fields: fields}, function(err, csv){
					
					if(err) console.log(err);
					
					fs.writeFile(fileName, csv, function(err){
						if (err){
							throw err;
						} 
						console.log('file saved');
						console.log(results);
						res.send({data : docs, nameExists : nameFound, fileExists: fileExists});
						
					});
				});
			}
			else{
				fileTweets = js2xmlparser("tweet", JSON.stringify(docs));
				fs.writeFile(fileName, fileTweets, function(err){
					if (err){
						throw err;
					} 
					console.log('file saved');
					console.log(results);
					res.send({data : docs, nameExists : nameFound, fileExists: fileExists});
					
				});
			}
		}); 
	}
});
	/*

				if(req.query.export=='1'){
				fileTweets =("tweet",(JSON.stringify(docs)));
				fs.writeFile(fileName, fileTweets, function(err){
					if(err){
						throw err;
					}
					console.log('file saved');
					console.log(results);
					res.send({data : docs, nameExists : nameFound, fileExists: fileExists});
					
				});
			}
			if(req.query.export=='2'){
				var fields = ['created_at', 'id', 'text', 'user.id', 'user.screen_name', 'user.location', 'user.followers_count', 'user.friends_count', 'user.created_at', 'user.time_zone', 'user.profile_background_color', 'user.profile_image_url', 'geo', 'coordinates', 'place'];
				json2csv({data: JSON.stringify(docs), fields: fields}, function(err, csv){
					
					if(err) console.log(err);
					
					fs.writeFile(fileName, csv, function(err){
						if (err){
							throw err;
						} 
						console.log('file saved');
						console.log(results);
						res.send({data : docs, nameExists : nameFound, fileExists: fileExists});
						
					});
				});
			}
			if(req.query.export=='3'){
				fileTweets = js2xmlparser("tweet", JSON.stringify(docs));
				fs.writeFile(fileName, fileTweets, function(err){
					if (err){
						throw err;
					} 
					console.log('file saved');
					console.log(results);
					res.send({data : docs, nameExists : nameFound, fileExists: fileExists});
					
				});
			}


	else{
		searchText = req.query.search.toString();
		database.collection(collectionName.toString()).createIndex({text : "text"});
		database.collection(collectionName.toString()).find({$text : {$search: searchText}}).limit(Number(count)).toArray(function (err, docs, callback){
			console.log("or is it here...");
			console.log(docs);

		}); 
	}

		//if there is no specific subset of tweets to be searched
	if(req.query.search==null){
		collection.find().limit(Number(count)).toArray(function(err, docs){
			results.push(docs);
			console.log("is something happening here?");

			if(req.query.export=='1'){
				fileTweets =("tweet",(JSON.stringify(results)));
				fs.writeFile(fileName, fileTweets, function(err){
					if(err){
						throw err;
					}
					console.log('file saved');
					console.log(results);
					res.send({data : results, nameExists : nameFound, fileExists: fileExists});
					
				});
			}
			if(req.query.export=='2'){
				var fields = ['created_at', 'id', 'text', 'user.id', 'user.screen_name', 'user.location', 'user.followers_count', 'user.friends_count', 'user.created_at', 'user.time_zone', 'user.profile_background_color', 'user.profile_image_url', 'geo', 'coordinates', 'place'];
				json2csv({data: JSON.stringify(results), fields: fields}, function(err, csv){
					
					if(err) console.log(err);
					
					fs.writeFile(fileName, csv, function(err){
						if (err){
							throw err;
						} 
						console.log('file saved');
						console.log(results);
						res.send({data : results, nameExists : nameFound, fileExists: fileExists});
						
					});
				});
			}
			if(req.query.export=='3'){
				fileTweets = js2xmlparser("tweet", JSON.stringify(results));
				fs.writeFile(fileName, fileTweets, function(err){
					if (err){
						throw err;
					} 
					console.log('file saved');
					console.log(results);
					res.send({data : results, nameExists : nameFound, fileExists: fileExists});
					
				});
			}
		});
	}
			console.log("i am confused");
			
		/*else{
			searchText = req.query.search.toString();
			collection.createIndex({text : "text"});
			collection.find({$text : {$search: searchText}}).limit(Number(count)).each(function (err, docs, callback){
				results.push(docs);
				console.log("or is it here...");
				console.log(results);
				
			});
		}*/




app.listen(3000, "127.0.0.1");
