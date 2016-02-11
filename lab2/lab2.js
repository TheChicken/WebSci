

function getLocation(){
	if(navigator.geolocation){

		navigator.geolocation.getCurrentPosition(showPosition);
	} else{
		$('#warning').appent("Geolocation is not supported by this browser.");
	}

	function showPosition (position){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat={" + position.coords.Latitude + "}&lon={" + position.coords.Longitude + "}&APPID={d85a72af46b6c4962441b4bae789e175}", false);
		xhr.send();

		$.get("http://api.openweathermap.org/data/2.5/weather?lat={" + position.coords.Latitude + "}&lon={" + position.coords.Longitude + "}&APPID={d85a72af46b6c4962441b4bae789e175}&units=imperial", function (response){
			
			$('#weatherInfo').append('<li class="weather container-fluid"><div class="col-md-8 col-sm-4"><output class = "temperature">' + response.main.temp + 'F</output><details class = "description">' + response.weather[0].description + '</details>');
		});
	}

}
