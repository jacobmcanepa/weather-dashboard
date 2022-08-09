var DateTime = luxon.DateTime;
var dt = DateTime.now();
var dtISO = dt.toString();
var formEl = document.querySelector("#form");
var locationInputEl = document.querySelector("#location");
var topContainerEl = document.querySelector("#top");
var bottomContainerEl = document.querySelector("#bottom");


var getLocationKey = function(location) {
  var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=1&appid=a97605dca80be3bef695a54ff827f901";
  
  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        if (data.length === 0) {
          alert("Error: City not found");
        } else {
          topContainerEl.innerHTML = "";
          bottomContainerEl.innerHTML = "";
          getForecast(data[0].lat, data[0].lon);
          getCurrentWeather(data[0].lat, data[0].lon);
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
      var icon = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";
      var rowEl = document.createElement("div");
      rowEl.classList = "row border border-dark w-98";
    
      var colEl = document.createElement("div");
      colEl.className = "col-12";
      colEl.innerHTML = "<h2 class='mt-1 font-weight-bold'>"
         + data.name + " (" + dt.month + "/" + dt.day + "/" + dt.year + ")<img src='" + icon + "' alt='weather-icon' /></h2>";
    
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
      topContainerEl.appendChild(rowEl);
    });
  })
  .catch(function(error) {
    alert("Unable to connect");
  });
};

var getForecast = function(lat, lon) {
  var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=a97605dca80be3bef695a54ff827f901";

  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      bottomContainerEl.innerHTML = "<h3>5 Day Forecast:</h3>";

      var rowEl = document.createElement("div");
      rowEl.classList = "row mt-3";

      // day one forecast
      var dayOneDiv = document.createElement("div");
      dayOneDiv.classList = "col mx-2 text-light bg-primary rounded pb-3";

      var dayOneList = document.createElement("ul");
      dayOneList.setAttribute("style", "list-style: none;");
      dayOneList.classList = "pl-0 mt-3";

      var dayOneDate = document.createElement("li");
      dayOneDate.className = "text-bold";
      dayOneDate.innerHTML = "<h4>(" + dt.month + "/" + (dt.day + 1) + "/" + dt.year + ")</h4>";
      dayOneList.appendChild(dayOneDate);

      var dayOneIcon = document.createElement("li");
      var icon1 ="http://openweathermap.org/img/wn/" + data.list[6].weather[0].icon + ".png";
      dayOneIcon.innerHTML = "<img src='" + icon1 + "' alt='icon' />";
      dayOneList.appendChild(dayOneIcon);

      var dayOneTemp = document.createElement("li");
      dayOneTemp.className = "forecast-list";
      dayOneTemp.innerHTML = "Temp: " + Math.floor(data.list[6].main.temp) + "F";
      dayOneList.appendChild(dayOneTemp);

      var dayOneWind = document.createElement("li");
      dayOneWind.className = "forecast-list";
      dayOneWind.innerHTML = "Wind: " + data.list[6].wind.speed + " MPH";
      dayOneList.appendChild(dayOneWind);

      var dayOneHumidity = document.createElement("li");
      dayOneHumidity.className = "forecast-list";
      dayOneHumidity.innerHTML = "Humidity: " + data.list[6].main.humidity + "%";
      dayOneList.appendChild(dayOneHumidity);
 
      dayOneDiv.appendChild(dayOneList);
      rowEl.appendChild(dayOneDiv);
      // end day one forecast

      // day two forecast
      var dayTwoDiv = document.createElement("div");
      dayTwoDiv.classList = "col mx-2 text-light bg-primary rounded pb-3";

      var dayTwoList = document.createElement("ul");
      dayTwoList.setAttribute("style", "list-style: none;");
      dayTwoList.classList = "pl-0 mt-3";

      var dayTwoDate = document.createElement("li");
      dayTwoDate.className = "text-bold";
      dayTwoDate.innerHTML = "<h4>(" + dt.month + "/" + (dt.day + 2) + "/" + dt.year + ")</h4>";
      dayTwoList.appendChild(dayTwoDate);

      var dayTwoIcon = document.createElement("li");
      var icon2 ="http://openweathermap.org/img/wn/" + data.list[14].weather[0].icon + ".png";
      dayTwoIcon.innerHTML = "<img src='" + icon2 + "' alt='icon' />";
      dayTwoList.appendChild(dayTwoIcon);

      var dayTwoTemp = document.createElement("li");
      dayTwoTemp.className = "forecast-list";
      dayTwoTemp.innerHTML = "Temp: " + Math.floor(data.list[14].main.temp) + "F";
      dayTwoList.appendChild(dayTwoTemp);

      var dayTwoWind = document.createElement("li");
      dayTwoWind.className = "forecast-list";
      dayTwoWind.innerHTML = "Wind: " + data.list[14].wind.speed + " MPH";
      dayTwoList.appendChild(dayTwoWind);

      var dayTwoHumidity = document.createElement("li");
      dayTwoHumidity.className = "forecast-list";
      dayTwoHumidity.innerHTML = "Humidity: " + data.list[14].main.humidity + "%";
      dayTwoList.appendChild(dayTwoHumidity);
 
      dayTwoDiv.appendChild(dayTwoList);
      rowEl.appendChild(dayTwoDiv);
      // end day two forecast

      // day three forecast
      var dayThreeDiv = document.createElement("div");
      dayThreeDiv.classList = "col mx-2 text-light bg-primary rounded pb-3";

      var dayThreeList = document.createElement("ul");
      dayThreeList.classList = "pl-0 mt-3";
      dayThreeList.setAttribute("style", "list-style: none;");

      var dayThreeDate = document.createElement("li");
      dayThreeDate.className = "text-bold";
      dayThreeDate.innerHTML = "<h4>(" + dt.month + "/" + (dt.day + 3) + "/" + dt.year + ")</h4>";
      dayThreeList.appendChild(dayThreeDate);

      var dayThreeIcon = document.createElement("li");
      var icon3 ="http://openweathermap.org/img/wn/" + data.list[22].weather[0].icon + ".png";
      dayThreeIcon.innerHTML = "<img src='" + icon3 + "' alt='icon' />";
      dayThreeList.appendChild(dayThreeIcon);

      var dayThreeTemp = document.createElement("li");
      dayThreeTemp.className = "forecast-list";
      dayThreeTemp.innerHTML = "Temp: " + Math.floor(data.list[22].main.temp) + "F";
      dayThreeList.appendChild(dayThreeTemp);

      var dayThreeWind = document.createElement("li");
      dayThreeWind.className = "forecast-list";
      dayThreeWind.innerHTML = "Wind: " + data.list[22].wind.speed + " MPH";
      dayThreeList.appendChild(dayThreeWind);

      var dayThreeHumidity = document.createElement("li");
      dayThreeHumidity.className = "forecast-list";
      dayThreeHumidity.innerHTML = "Humidity: " + data.list[22].main.humidity + "%";
      dayThreeList.appendChild(dayThreeHumidity);
 
      dayThreeDiv.appendChild(dayThreeList);
      rowEl.appendChild(dayThreeDiv);
      // end day three forecast

      // day four forecast
      var dayFourDiv = document.createElement("div");
      dayFourDiv.classList = "col mx-2 text-light bg-primary rounded pb-3";

      var dayFourList = document.createElement("ul");
      dayFourList.classList = "pl-0 mt-3";
      dayFourList.setAttribute("style", "list-style: none;");

      var dayFourDate = document.createElement("li");
      dayFourDate.className = "text-bolder";
      dayFourDate.innerHTML = "<h4>(" + dt.month + "/" + (dt.day + 4) + "/" + dt.year + ")</h4>";
      dayFourList.appendChild(dayFourDate);

      var dayFourIcon = document.createElement("li");
      var icon4 ="http://openweathermap.org/img/wn/" + data.list[30].weather[0].icon + ".png";
      dayFourIcon.innerHTML = "<img src='" + icon4 + "' alt='icon' />";
      dayFourList.appendChild(dayFourIcon);

      var dayFourTemp = document.createElement("li");
      dayFourTemp.className = "forecast-list";
      dayFourTemp.innerHTML = "Temp: " + Math.floor(data.list[30].main.temp) + "F";
      dayFourList.appendChild(dayFourTemp);

      var dayFourWind = document.createElement("li");
      dayFourWind.className = "forecast-list";
      dayFourWind.innerHTML = "Wind: " + data.list[30].wind.speed + " MPH";
      dayFourList.appendChild(dayFourWind);

      var dayFourHumidity = document.createElement("li");
      dayFourHumidity.className = "forecast-list";
      dayFourHumidity.innerHTML = "Humidity: " + data.list[30].main.humidity + "%";
      dayFourList.appendChild(dayFourHumidity);
 
      dayFourDiv.appendChild(dayFourList);
      rowEl.appendChild(dayFourDiv);
      // end day four forecast

      // day five forecast
      var dayFiveDiv = document.createElement("div");
      dayFiveDiv.classList = "col mx-2 text-light bg-primary rounded pb-3";

      var dayFiveList = document.createElement("ul");
      dayFiveList.classList = "pl-0 mt-3";
      dayFiveList.setAttribute("style", "list-style: none;");

      var dayFiveDate = document.createElement("li");
      dayFiveDate.className = "text-bolder";
      dayFiveDate.innerHTML = "<h4>(" + dt.month + "/" + (dt.day + 5) + "/" + dt.year + ")</h4>";
      dayFiveList.appendChild(dayFiveDate);

      var dayFiveIcon = document.createElement("li");
      var icon5 ="http://openweathermap.org/img/wn/" + data.list[38].weather[0].icon + ".png";
      dayFiveIcon.innerHTML = "<img src='" + icon5 + "' alt='icon' />";
      dayFiveList.appendChild(dayFiveIcon);

      var dayFiveTemp = document.createElement("li");
      dayFiveTemp.className = "forecast-list";
      dayFiveTemp.innerHTML = "Temp: " + Math.floor(data.list[38].main.temp) + "F";
      dayFiveList.appendChild(dayFiveTemp);

      var dayFiveWind = document.createElement("li");
      dayFiveWind.className = "forecast-list";
      dayFiveWind.innerHTML = "Wind: " + data.list[38].wind.speed + " MPH";
      dayFiveList.appendChild(dayFiveWind);

      var dayFiveHumidity = document.createElement("li");
      dayFiveHumidity.className = "forecast-list";
      dayFiveHumidity.innerHTML = "Humidity: " + data.list[38].main.humidity + "%";
      dayFiveList.appendChild(dayFiveHumidity);
 
      dayFiveDiv.appendChild(dayFiveList);
      rowEl.appendChild(dayFiveDiv);
      // endday five forecast

      bottomContainerEl.appendChild(rowEl);
    });
  })
  .catch(function(error) {
    alert("Unable to connect");
  });
}

formEl.addEventListener("submit", formSubmitHandler);
