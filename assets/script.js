$(document).ready(function () {
  function selectCities(cityname) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";
    var apiKey = "2bbd84d695f75e90260a321f5b80b8b5";

    console.log("run search was clicked");
    $("#city-input").val(""); //empty input after submit

    $.ajax({
      url: queryURL + cityname + "&units=imperial&appid=" + apiKey,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      $("#current").empty();

      //new div to layout single day information
      var newDiv = $("<div class='new-div'>");
      $("#current").prepend(newDiv);

      //text from api object
      var cityHeading = $("<h3>").text(response.name);
      var date = $("<h6>").text(moment().format("dddd, MMMM Do")); //moment.js to store date.
      cityHeading.append(date);

      var temperature = $("<p>").text(
        "Temperature: " + response.main.temp + "°F"
      );
      var humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
      var windSpeed = $("<p>").text(
        "Wind Speed " + response.wind.speed + "MPH"
      );

      //append last
      $(newDiv).append(cityHeading, temperature, humidity, windSpeed);

      //----------------------------------------------------------------------------------------------------------------------------------//

      //retrieve coordinates from first api call.
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      //call api
      var queryURLUV =
        "https://api.openweathermap.org/data/2.5/uvi?&appid=2bbd84d695f75e90260a321f5b80b8b5&lat=" +
        lat +
        "&lon=" +
        lon;

      //call for uv measurements
      $.ajax({
        url: queryURLUV,
        method: "GET",
      }).then(function (uv) {
        console.log(uv);

        var uvIntro = $("<p>").text("UV Index: ");
        newDiv.append(uvIntro);

        //uv button
        var uvDiv = $("<div>").attr("id", "uv-div");
        var uvText = $("<p>");
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

        if (uv.value > 8) {
          uvIndex.css("background-color", "red");
        } else if (uv.value > 6 && uv.value < 8) {
          uvIndex.css("background-color", "orange");
        } else if (uv.value > 3 && uv.value < 6) {
          uvIndex.css("background-color", "yellow");
        } else if (uv.value > 0 && uv.value < 2) {
          uvIndex.css("background-color", "green");
        }
      });
    });

    //----------------------------------------------------------------------------------------------------------------------------------//

    // third api call for five day forecast.

    var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=";

    $.ajax({
      url: queryForecast + cityname + "&units=imperial&appid=" + apiKey,
      method: "GET",
    }).then(function (res) {
      console.log(res);

      //empty section upon submit
      $("#five-day").empty();
      //attach variable to list of dates.
      var results = res.list;

      // - loop over the list every 8 items - should loop five times over five days to get the weather at 18:00pm each day.
      for (var i = 0; i < results.length; i += 8) {
        //build five cards with required information
        var cardBody = $(
          "<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>"
        );
        cardBody.attr("id", "card-body");

        //variables to store information.
        var dateTwo = results[i].dt_txt;
        var setD = dateTwo.substr(0, 10);
        var temp = results[i].main.temp;
        var hum = results[i].main.humidity;

        //variables to assign text.
        var h5date = $("<h5 class='card-title'>").text(setD);
        var pTemp = $("<p class='card-text'>").text(
          "Temperature: " + temp + "°F"
        );
        var pHum = $("<p class='card-text'>").text("Humidity " + hum + "%");

        //append text to cardbody.
        cardBody.append(h5date, pTemp, pHum);
        //append card to html section.
        $("#five-day").append(cardBody);

        //----------------------------------------------------------------------------------------------------------------------------------//

        //weather symbols


      }
    });
  }

  //----------------------------------------------------------------------------------------------------------------------------------//

  $("#select-city").on("click", function (e) {
    e.preventDefault();
    var cityname = $("#city-input").val().trim().toLowerCase();

    //save user input to local storage
    JSON.parse(localStorage.getItem(cityname));
    localStorage.setItem(cityname, JSON.stringify(cityname));

    //create search button.
    var searchBtn = $(
      "<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>"
    ).text(cityname);
    $("#history-section").append(searchBtn);

    //give it an onclick function - when button is pressed it retrieves the text within it,
    //which is save as city, and then the main function is ran again with var city as argument.
    //runs main function for history section
    searchBtn[0].onclick = function (e) {
      e.preventDefault();
      var city = $(this).text();
      console.log(city);

      selectCities(city);

      console.log("fired");
    };

    //runs main function on input.
    selectCities(cityname);
  });

  //----------------------------------------------------------------------------------------------------------------------------------//
  
  // clear button


});
