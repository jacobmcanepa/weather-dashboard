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
          infoSectionEl.innerHTML = "";
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
      containerEl.classList = "container mt-3";
    
      var rowEl = document.createElement("div");
      rowEl.classList = "row border border-dark w-98";
    
      var colEl = document.createElement("div");
      colEl.className = "col-12";
      colEl.innerHTML = "<h2 class='mt-1 font-weight-bold'>" + data.name + " (" + dt.month + "/" + dt.day + "/" + dt.year + ")</h2>";
    
      var listEl = document.createElement("ul");
      listEl.setAttribute("style", "list-style: none;");
      listEl.className = "pl-0";

      var tempEl = document.createElement("li");
      tempEl.classList = "pb-2 info-list-top";
      tempEl.textContent = "Temp: " + Math.floor(data.main.temp) + "F";
      listEl.appendChild(tempEl);

      var windEl = document.createElement("li");
      windEl.classList = "pb-2 info-list-top";
      windEl.textContent = "Wind: " + data.wind.speed + " MPH";
      listEl.appendChild(windEl);

      var humidityEl = document.createElement("li");
      humidityEl.classList = "pb-2 info-list-top";
      humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
      listEl.appendChild(humidityEl);

      fetch(uvUrl, {headers: {"x-access-token": uvApiKey}}).then(function(response) {
        response.json().then(function(data) {
          console.log(data);
          var uvIndexEl = document.createElement("li");
          uvIndexEl.classList = "pb-2 info-list-top";

          if (data.result.uv <= 3) {
            uvIndexEl.innerHTML = "UV Index: <span class='uv-low text-center text-light px-3 py-1 rounded'>" + data.result.uv + "</span>";
            listEl.appendChild(uvIndexEl); 
          }

          else if (data.result.uv <= 6) {
            uvIndexEl.innerHTML = "UV Index: <span class='uv-mod text-center text-light px-3 py-1 rounded'>" + data.result.uv + "</span>";
            listEl.appendChild(uvIndexEl); 
          }

          else if (data.result.uv <= 8) {
            uvIndexEl.innerHTML = "UV Index: <span class='uv-high text-center text-light px-3 py-1 rounded'>" + data.result.uv + "</span>";
            listEl.appendChild(uvIndexEl); 
          }

          else if (data.result.uv <= 11) {
            uvIndexEl.innerHTML = "UV Index: <span class='uv-vhigh text-center text-light px-3 py-1 rounded'>" + data.result.uv + "</span>";
            listEl.appendChild(uvIndexEl); 
          }

          else if (data.result.uv > 11) {
            uvIndexEl.innerHTML = "UV Index: <span class='uv-extr text-center text-light px-3 py-1 rounded'>" + data.result.uv + "</span>";
            listEl.appendChild(uvIndexEl); 
          }
        });
      })
      .catch(function(error) {
        uvIndexEl.innerHTML = "UV Index: Unable to connect";
        listEl.appendChild(uvIndexEl);
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
