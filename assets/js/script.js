var DateTime = luxon.DateTime;
var dt = DateTime.now();
var dtISO = dt.toString();
var formEl = document.querySelector("#form");
var locationInputEl = document.querySelector("#location");
var topContainerEl = document.querySelector("#top");
var bottomContainerEl = document.querySelector("#bottom");
var buttonListEl = document.querySelector("#button-list");
var mainEl = document.querySelector("main");
var saved = JSON.parse(localStorage.getItem("saved")) || [];

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
  var locValue = locationInputEl.value
  var array = locValue.split(" ");
  
  for (var i = 0; i < array.length; i++) {
    array[i] = array[i].charAt(0).toUpperCase() + array[i].slice(1);
  }

  var buttonLocValue = array.join(" ");

  if (location) {
    getLocationKey(location);
    createButton(buttonLocValue);
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
      console.log(data);
      bottomContainerEl.innerHTML = "<h3>5 Day Forecast:</h3>";

      var rowEl = document.createElement("div");
      rowEl.classList = "row mt-3";

      /* DAY ONE */
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
      // filter icon to day time
      var firstIcon = data.list[6].weather[0].icon;
      var firstArray = firstIcon.split("");
      firstArray.pop();
      firstArray.push("d");
      var filteredIcon1 = firstArray.join("");
      // end of filter
      var icon1 ="http://openweathermap.org/img/wn/" + filteredIcon1 + ".png";
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

      /* DAY TWO */
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
      // filter icon to day time
      var secondIcon = data.list[14].weather[0].icon;
      var secondArray = secondIcon.split("");
      secondArray.pop();
      secondArray.push("d");
      var filteredIcon2 = secondArray.join("");
      // end of filter
      var icon2 ="http://openweathermap.org/img/wn/" + filteredIcon2 + ".png";
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

      /* DAY THREE */
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
      // filter icon to day time
      var thirdIcon = data.list[22].weather[0].icon;
      var thirdArray = thirdIcon.split("");
      thirdArray.pop();
      thirdArray.push("d");
      var filteredIcon3 = thirdArray.join("");
      // end of filter
      var icon3 ="http://openweathermap.org/img/wn/" + filteredIcon3 + ".png";
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

      /* DAY FOUR */
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
      // filter icon to day time
      var fourthIcon = data.list[30].weather[0].icon;
      var fourthArray = fourthIcon.split("");
      fourthArray.pop();
      fourthArray.push("d");
      var filteredIcon4 = fourthArray.join("");
      // end of filter
      var icon4 ="http://openweathermap.org/img/wn/" + filteredIcon4 + ".png";
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

      /* DAY FIVE */
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
      // filter icon to day time
      var fifthIcon = data.list[38].weather[0].icon;
      var fifthArray = fifthIcon.split("");
      fifthArray.pop();
      fifthArray.push("d");
      var filteredIcon5 = fifthArray.join("");
      // end of filter
      var icon5 ="http://openweathermap.org/img/wn/" + filteredIcon5 + ".png";
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
      // end day five forecast

      bottomContainerEl.appendChild(rowEl);
    });
  })
  .catch(function(error) {
    alert("Unable to connect");
  });
};

// add code that pushes location name to local storage
// create load function that iterates through local storage (which will be parsed back onto an array) and creates button for each location

var createButton = function(location) {
  var listItem = document.createElement("li");
  listItem.classList = "my-2 list-item";
  listItem.setAttribute("id", location);

  var buttonEl = document.createElement("button");
  buttonEl.classList = "col-12 btn btn-secondary saved";
  buttonEl.textContent = location;
  listItem.appendChild(buttonEl);

  buttonListEl.appendChild(listItem);
};

var savedButtonHandler = function(event) {
  var targetEl = event.target;

  if (targetEl.matches(".saved")) {
    getLocationKey(targetEl.textContent);
  }
};

formEl.addEventListener("submit", formSubmitHandler);
mainEl.addEventListener("click", savedButtonHandler);
