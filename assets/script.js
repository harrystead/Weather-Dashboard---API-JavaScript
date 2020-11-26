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

      //----------------------------------------------------------------------------------------------------------------------------------//

      // symbol for single day:
      console.log(response.weather[0].main);
      var currentweather = response.weather[0].main;

      if (currentweather === "Rain") {
        var currentIcon = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/wn/09d.png"
        );
        currentIcon.attr("style", "height: 60px; width: 60px");
      } else if (currentweather === "Clouds") {
        var currentIcon = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/wn/03d.png"
        );
        currentIcon.attr("style", "height: 60px; width: 60px");
      } else if (currentweather === "Clear") {
        var currentIcon = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/wn/01d.png"
        );
        currentIcon.attr("style", "height: 60px; width: 60px");
      } else if (currentweather === "Drizzle") {
        var currentIcon = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/wn/10d.png"
        );
        currentIcon.attr("style", "height: 60px; width: 60px");
      } else if (currentweather === "Snow") {
        var currentIcon = $("<img>").attr(
          "src",
          "http://openweathermap.org/img/wn/13d.png"
        );
        currentIcon.attr("style", "height: 60px; width: 60px");
      }

      //append last
      $(newDiv).append(
        cityHeading,
        currentIcon,
        temperature,
        humidity,
        windSpeed
      );

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

       //pixabay api - gained full access, so is working for all cities now.
       $.ajax({
        url: "https://pixabay.com/api/?key=19275947-8e03c0cef66a2d07d81888dc3&q="+ cityname + "+city+urban&image_type=photo",
        method: "GET",
      }).then(function (maps) {
        console.log(maps);

        var cityImage = maps.hits[4];
        console.log(maps.hits[0]);

        var image = $("<img>");
        image.attr("src", cityImage.webformatURL);
        image.attr("id", "image-city")

        $("#id-card").append(image);

      })

    //----------------------------------------------------------------------------------------------------------------------------------//

    // fourth api call for five day forecast.

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
          "<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 11rem; height: 13rem;'>"
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

        //----------------------------------------------------------------------------------------------------------------------------------//

        //weather symbols for five day

        var weather = results[i].weather[0].main;

        if (weather === "Rain") {
          var symbolFive = $("<img>").attr(
            "src",
            "http://openweathermap.org/img/wn/09d.png"
          );
          symbolFive.attr("style", "height: 40px; width: 40px");
        } else if (weather === "Clouds") {
          var symbolFive = $("<img>").attr(
            "src",
            "http://openweathermap.org/img/wn/03d.png"
          );
          symbolFive.attr("style", "height: 40px; width: 40px");
        } else if (weather === "Clear") {
          var symbolFive = $("<img>").attr(
            "src",
            "http://openweathermap.org/img/wn/01d.png"
          );
          symbolFive.attr("style", "height: 40px; width: 40px");
        } else if (weather === "Drizzle") {
          var symbolFive = $("<img>").attr(
            "src",
            "http://openweathermap.org/img/wn/10d.png"
          );
          symbolFive.attr("style", "height: 40px; width: 40px");
        } else if (weather === "Snow") {
          var symbolFive = $("<img>").attr(
            "src",
            "http://openweathermap.org/img/wn/13d.png"
          );
          symbolFive.attr("style", "height: 40px; width: 40px");
        }

              //append text to cardbody.
              cardBody.append(h5date, pTemp, pHum, symbolFive);
              //append card to html section.
              $("#five-day").append(cardBody);
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
    searchBtn.attr("id", "history-search")
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
