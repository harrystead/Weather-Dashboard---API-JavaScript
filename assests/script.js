



$(document).ready(function () {
    $("#search-btn").on("click", function (e) {
      console.log("run search was clicked");
      e.preventDefault();
  
      var queryURL =
        "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
  
      $.ajax({
        url: queryURL + searchInput + "&api-key=" + apiKey ,
        method: "GET",
      }).then(function (res) {
        console.log(res);
  
        for (var i = 0; i < noOfResults; i++) {
            console.log(noOfResults)