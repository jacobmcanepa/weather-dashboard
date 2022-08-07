var formEl = document.querySelector("#form");
var locationInputEl = document.querySelector("#location");

var getLocationKey = function(location) {
  var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=1&appid=a97605dca80be3bef695a54ff827f901";
  
  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      getCurrentWeather(data[0].lat, data[0].lon);
      getForecast(data[0].lat, data[0].lon);
    });
  });
};


var formSubmitHandler = function(event) {
  event.preventDefault();

  var location = locationInputEl.value.trim();

  if (location) {
    getLocationKey(location);
    locationInputEl.value = "";
  }

  else {
    alert("Please enter a valid city");
  }
};

var getCurrentWeather = function(lat, lon) {
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=a97605dca80be3bef695a54ff827f901";

  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      console.log(data);
    });
  });
};

var getForecast = function(lat, lon) {
  var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=a97605dca80be3bef695a54ff827f901";

  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      console.log(data);
    });
  });
}

formEl.addEventListener("submit", formSubmitHandler);
