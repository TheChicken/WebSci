$(document).ready(function(){
    
    navigator.geolocation.getCurrentPosition(handle_geolocation_query, handle_errors);

    function handle_errors(error)
            {
                switch(error.code)
                {
                    case error.PERMISSION_DENIED: alert("user did not share geolocation data");
                    break;
     
                    case error.POSITION_UNAVAILABLE: alert("could not detect current position");
                    break;
     
                    case error.TIMEOUT: alert("retrieving position timed out");
                    break;
     
                    default: alert("unknown error");
                    break;
                }
            }

    function handle_geolocation_query(position){

        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&cnt=10&units=imperial&APPID=d85a72af46b6c4962441b4bae789e175",
            method: 'GET',
            dataType: "jsonp",

            success:function(response){

                console.log(response);

                var fullDate = new Date();
                console.log(fullDate);
                var months = {'0':'Jan', '1':'Feb', '2':'Mar', '3':'Apr', '4':'May', '5':'Jun', '6':'Jul', '7':'Aug', '8':'Sep', '9':'Oct', '10':'Nov', '11':'Dec'}
                var date = new Date();
                var month = date.getMonth();
                var day = date.getDate();

                var temperatureF = (response.list[0].deg * (9/5) - 459.67).toFixed(0)

                $('.city').html(response.city.name + ', ' +response.city.country);
                $('.temp').html(temperatureF);
                $('.todayDate').html(months[month] + ' ' +day);
                $('.weatherIcon').html('<img alt="icon" id="icon" src="http://openweathermap.org/img/w/' + response.list[0].weather[0].icon + '.png"/>');
                $('.weatherGroup').html(response.list[0].weather[0].main);
                $('.weatherDesc').html(response.list[0].weather[0].description);
                $('.windSpeed').html(response.list[0].speed);
                $('.humidity').html(response.list[0].humidity);

                

                for(var i=1; i<=9; i++){
                
                    var months = {'0':'Jan', '1':'Feb', '2':'Mar', '3':'Apr', '4':'May', '5':'Jun', '6':'Jul', '7':'Aug', '8':'Sep', '9':'Oct', '10':'Nov', '11':'Dec'}
                    var date = new Date();
                    date.setDate(date.getDate() + i);
                    console.log(date);
                    var month = date.getMonth();
                    var day = date.getDate();


                    $('.forecast').append('<div class="col-xs-1" id="forecasts"><p id="forIcon"><span class="forIcon"><p id="forWeather"><p id="date"><span class="forDate">' + months[month] + ' ' + day + '</span></p><img alt="icon" id="icon" src="http://openweathermap.org/img/w/' + response.list[i].weather[0].icon + '.png"/></span><p id="weater"><span class="weather">' + response.list[i].weather[0].main + '</span></p><p id="forMax">Max: <span class="forMax">' + (response.list[i].temp.max).toFixed(0) + '</span>&deg;F</p><p id="forMin">Min: <span class="forMin">' + (response.list[i].temp.min).toFixed(0) + '</span>&deg;F</p></div>');
                }
            }
        });

    }
});
