
  

$(document).ready(function () {

    function selectCities (cityname) {

      var apiKey = "2bbd84d695f75e90260a321f5b80b8b5";
      var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
      var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=";  

      console.log("run search was clicked");

      $.ajax({
        url:  queryURL + cityname + "&units=imperial&appid=" + apiKey,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        $("#current").empty();

        var newDiv = $("<div class='new-div'>");
        $("#current").prepend(newDiv);

        var cityHeading = $("<h3>").text(response.name);
        var date = $("<h6>").text(moment().format("dddd, MMMM Do"));
        cityHeading.append(date);

        var temperature = $("<p>").text("Temperature: " + response.main.temp + "°F");
        var humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var windSpeed = $("<p>").text("Wind Speed " + response.wind.speed + "MPH");

        $(newDiv).append(cityHeading, temperature, humidity, windSpeed);
        })

      var lat = response.coord.lat;
      var lon = response.coord.lon;
      var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=2bbd84d695f75e90260a321f5b80b8b5&lat=" + lat  + "&lon=" + lon;

        //call for uv measurementS
        $.ajax({
            url: queryURLUV,
            method: 'GET'
        }).then(function (uv) {
            console.log(uv);

            var uvIntro = $("<p>").text("UV Index: ");
            newDiv.append(uvIntro);

            var uvDiv = $("<div>").attr("id", "uv-div");
            var uvText = $("<p>")
            uvText.css("color", "white");
            var uvIndex = $("<button>").text(uv.value);
            uvText.append(uvIndex);
            uvIndex.attr("id", "uv-index");
            uvDiv.append(uvText);
            newDiv.append(uvDiv);

            //uv index grades.
            //8-10, high
            //6-7, medium
            //3-5, low-medium
            //0-2, low.

            if(uv.value > 8) {
            uvIndex.css("background-color", "red");
            }
            else if(uv.value > 6 && uv.value < 8) {
            uvIndex.css("background-color", "orange");
            }
            else if(uv.value > 3 && uv.value < 6) {
                uvIndex.css("background-color", "yellow");
            }
            else if(uv.value > 0 && uv.value < 2) {
                uvIndex.css("background-color", "green");
            }
          }
      });
    

      $.ajax({
        url:  queryForecast + cityname + "&units=imperial&appid=" + apiKey,
        method: "GET",
      }).then(function (res) {
        console.log(res);
        $("#five-day").empty();
        var results = res.list;

        // - loop over the list every 8 items - should loop five times over five days to get the weather at 18:00pm each day.
        for(var i = 0; i < results.length; i += 8) {

        var cardBody = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");
        cardBody.attr("id", "card-body");
        
        var dateTwo = results[i].dt_txt;
        var setD = dateTwo.substr(0,10)
        var temp = results[i].main.temp;
        var hum = results[i].main.humidity;
        console.log()

        var h5date = $("<h5 class='card-title'>").text(setD);
        var pTemp = $("<p class='card-text'>").text("Temperature: " + temp + "°F");;
        var pHum = $("<p class='card-text'>").text("Humidity " + hum + "%");

        cardBody.append(h5date, pTemp, pHum);
        $("#five-day").append(cardBody);
        }
  
      });

      $("#select-city").on("click", function (e) {
        e.preventDefault();

       var cityInput = $("#city-input").val().trim().toLowerCase();

       localStorage.setItem("city name" , JSON.stringify(cityInput));
       localStorage.getItem("city name", JSON.stringify(cityInput));

       var searchText = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(cityInput);
       searchText.attr("id", "history-button");
 
       var searchDiv = $("<div>");
       searchDiv.append(searchText)
       $("#search-history").append(searchText);

      selectCities(cityInput);
      });

    $("#history-button").on("click", function (event) {
      event.preventDefault();
      ("run search was clicked");
     
    })
});
  
