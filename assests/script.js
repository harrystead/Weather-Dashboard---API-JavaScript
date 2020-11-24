
$(document).ready(function () {

    $("#select-city").on("click", function (e) {
      console.log("run search was clicked");
      e.preventDefault();
  
      var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
      var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=";

      var cityNames = $("#city-input").val().trim().toLowerCase();
      var apiKey = "2bbd84d695f75e90260a321f5b80b8b5";
  
      $.ajax({
        url:  queryURL + cityNames + "&units=imperial&appid=" + apiKey,
        method: "GET",
      }).then(function (response) {
        console.log(response);

        var newDiv = $("<div class='new-div'>");
        $("#current").prepend(newDiv);

        var cityHeading = $("<h3>").text(response.name);
        var date = $("<h6>").text(moment().format("dddd, MMMM Do"));
        cityHeading.append(date);


        var temperature = $("<p>").text("Temperature: " + response.main.temp + "°F");
        var humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var windSpeed = $("<p>").text("Wind Speed " + response.wind.speed + "MPH");

        $(newDiv).append(cityHeading, temperature, humidity, windSpeed);


       var lat = response.coord.lat;
       var lon = response.coord.lon;
       var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=2bbd84d695f75e90260a321f5b80b8b5&lat=" + lat  + "&lon=" + lon;

        //call for uv measurement
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
      });

      $.ajax({
        url:  queryForecast + cityNames + "&units=imperial&appid=" + apiKey,
        method: "GET",
      }).then(function (res) {
        console.log(res);
        $("#five-day").empty();
        var results = res.list;
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
      function saveLocal () {

      localStorage.setItem('cityName', JSON.stringify(cityNames));

      var storeCities = [];
      storeCities.push(cityNames)
      console.log(storeCities);
      }

      saveLocal();
      getLocal();

      function getLocal () {

        localStorage.getItem('cityName', JSON.stringify(cityNames));
        var searchText = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(cityNames);
        searchText.attr("id", "history-button");
        var searchDiv = $("<div>");
        searchDiv.append(searchText)
        $("#search-history").append(searchText);

      }
    })
    });

    $("#history-button").on("click", function () {

    })

});
  
