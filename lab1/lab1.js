//Javascript file to read in tweets json and display them onto the page.
//The script will attach needed information from the json to a list item element
//Once loaded, animation will create a "ticker" utilizing jquery's fadeout
//and slide down functions. 

$.getJSON("tweetsFromTwitter.json", function(data){
	for(var i=0; i<5; i++){
		$('#tweetFeed').append('<li class = "tweet container-fluid"><div class="col-xs-12"><div id ="image-cropper" class="col-sm-2"><img class="rounded" src="' + data[i].user.profile_image_url + '"></div><div class "col-sm-8"><p class="message">' + data[i].text +'</p></div></div></li>');
	}
	//load first five and pause
	setTimeout(function(){
		getNext(5, data);
	}, 4000);
})
//function to get the next tweet and append it to the DOM 
function getNext(i, data){
	$('#tweetFeed li').last().fadeOut(500, function(){
		$(this).remove();
		$('#tweetFeed').slideDown(500, function(){
			$('<li class = "tweet container-fluid"><div class="col-xs-12"><div id ="image-cropper" class="col-sm-2"><img class="rounded" src="' + data[i].user.profile_image_url + '"></div><div class "col-sm-8"><p class="message">' + data[i].text +'</p></div></div></li>').prependTo($(this)).fadeIn(500);
		});
	});
	
	setTimeout(function(){
		getNext(i+1, data);
	}, 4000);
	return;
};

