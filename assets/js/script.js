var DateTime = luxon.DateTime;
var dt = DateTime.now();
var dtISO = dt.toString();
var formEl = document.querySelector("#form");
var locationInputEl = document.querySelector("#location");
var infoSectionEl = document.querySelector("#info-section");


var getLocationKey = function(location) {
  var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=1&appid=a97605dca80be3bef695a54ff827f901";
  
  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        if (data.length === 0) {
          alert("Error: City not found");
        } else {
          getCurrentWeather(data[0].lat, data[0].lon);
          //getForecast(data[0].lat, data[0].lon);
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
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=a97605dca80be3bef695a54ff827f901";
  var uvUrl = "https://api.openuv.io/api/v1/uv?lat=" + lat + "&lng=" + lon + "&dt=" + dtISO;
  var uvApiKey = "c8dab66f174ed1965b2ba6c58f0746e8";

  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      console.log(data);

      var containerEl = document.createElement("div");
      containerEl.classList = "container my-1";
    
      var rowEl = document.createElement("div");
      rowEl.className = "row";
    
      var colEl = document.createElement("div");
      colEl.className = "col-12";
    
      var listEl = document.createElement("ul");
      listEl.setAttribute("style", "list-style: none;");
      colEl.innerHTML = "<h2>" + data.name + " (" + dt.month + "/" + dt.day + "/" + dt.year + ")</h2>";

      var tempEl = document.createElement("li");
      tempEl.textContent = "Temp: " + Math.floor(data.main.temp) + "F";
      listEl.appendChild(tempEl);

      var windEl = document.createElement("li");
      windEl.textContent = "Wind: " + data.wind.speed + " MPH";
      listEl.appendChild(windEl);

      var humidityEl = document.createElement("li");
      humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
      listEl.appendChild(humidityEl);

      fetch(uvUrl, {headers: {"x-access-token": uvApiKey}}).then(function(response) {
        response.json().then(function(data) {
          console.log(data);
    
          var uvIndexEl = document.createElement("li");
          uvIndexEl.innerHTML = "UV Index: <span class='bg-primary text-center text-light px-3 py-1'>" + data.result.uv + "</span>";
          listEl.appendChild(uvIndexEl); 
        });
      })
      .catch(function(error) {
        uvIndexEl.textContent = "UV Index: Unable to connect";
      });

      colEl.appendChild(listEl);
      rowEl.appendChild(colEl);
      containerEl.appendChild(rowEl);
      infoSectionEl.appendChild(containerEl);
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
