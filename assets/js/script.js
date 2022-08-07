var formEl = document.querySelector("#form");
var locationInputEl = document.querySelector("#location");

var getLocationKey = function(location) {
  var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=1&appid=a97605dca80be3bef695a54ff827f901";
  
  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        if (data.length === 0) {
          alert("Error: City not found");
        } else {
          getCurrentWeather(data[0].lat, data[0].lon);
          getForecast(data[0].lat, data[0].lon);
        }
      });
    }

    else {
      alert("Error: City not found");
    }
  })
  .catch(function(error) {
    alert("Unable to connect");
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
  })
  .catch(function(error) {
    alert("Unable to connect");
  });
};

var getForecast = function(lat, lon) {
  var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=a97605dca80be3bef695a54ff827f901";

  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      console.log(data);
    });
  })
  .catch(function(error) {
    alert("Unable to connect");
  });
}

formEl.addEventListener("submit", formSubmitHandler);
