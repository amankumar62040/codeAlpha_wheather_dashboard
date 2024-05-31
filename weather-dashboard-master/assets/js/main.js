var apikey = "f408733541f79d3cc2e15ea6c311e06f";
var winddir = "";
var lon = 0;
var lat = 0;
var city = "New York,NY,USA";
var cities = [];
var imgURL = 'cloudy.jpg';
var cityInfo = {
  "name": "",
  "lat": 0,
  "lon": 0
};
var cloudIconURL = "https://openweathermap.org/img/w/";
var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=40.73&lon=-73.99&units=imperial&exclude=minutely,hourly&appid=${apikey}`;
// function setting apropriate color to UV index
function getUVIndexColor(n) {
  switch (true) {
    case n > 0 && n <= 1:
      $("#uv").css("background-color", "#41d924");
      break;
    case n > 1 && n <= 3:
      $("#uv").css("background-color", "#afcc24");
      break;
    case n > 3 && n <= 6:
      $("#uv").css("background-color", "#d6c422");
      break;
    case n > 6 && n <= 8:
      $("#uv").css("background-color", "#cc4620");
      break;
    case n > 8 && n <= 10:
      $("#uv").css("background-color", "#bd071e");
      break;
    case n > 10:
      $("#uv").css("background-color", "#cd008d");
      break;
    default:
      break;
  }
}
// function translates wind direction degree to normal directions
function getWindDir(deg) {
  switch (true) {
    case deg < 11.25 || deg >= 348.75:
      return "N ";
    case deg >= 11.25 && deg < 33.75:
      return "NNE ";
    case deg >= 33.75 && deg < 56.25:
      return "NE ";
    case deg >= 56.25 && deg < 78.75:
      return "ENE ";
    case deg >= 78.75 && deg < 101.25:
      return "E ";
    case deg >= 101.25 && deg < 123.75:
      return "ESE ";
    case deg >= 123.75 && deg < 146.25:
      return "SE ";
    case deg >= 146.25 && deg < 168.75:
      return "SSE ";
    case deg >= 168.75 && deg < 191.25:
      return "S ";
    case deg >= 191.25 && deg < 213.75:
      return "SSW ";
    case deg >= 213.75 && deg < 236.25:
      return "SW ";
    case deg >= 236.25 && deg < 258.75:
      return "WSW ";
    case deg >= 258.75 && deg < 281.25:
      return "W ";
    case deg >= 281.25 && deg < 303.75:
      return "WNW ";
    case deg >= 303.75 && deg < 326.25:
      return "NW ";
    case deg >= 326.25 && deg < 348.75:
      return "NNW ";
    default:
      return "No Wind";
  }
};
// storing cities in Local Storage
function storeCities() {
  // Stringify and send cities in localStorage 
  localStorage.setItem("cities", JSON.stringify(cities));
}
// pulling the coppy of the preset cities from Local storage
function citiesFromStorage() {
  // retrive cities from storage
  var storedResults = JSON.parse(localStorage.getItem("cities"));
  // If  were retrieved from localStorage, update cities array it
  if (storedResults !== null) {
    cities = storedResults;
  }

}
// change fahrenheit to celsius and back
function changeSystem() {
  let s = $("#system").text();
  if (s === "\xB0F") {
    $("#imp1").attr("class", "hidden");
    $("#imp2").attr("class", "hidden");
    $("#metr1").attr("class", "");
    $("#metr2").attr("class", "");
    $("#system").text("\xB0C");
  } else {
    $("#imp1").attr("class", "");
    $("#imp2").attr("class", "");
    $("#metr1").attr("class", "hidden");
    $("#metr2").attr("class", "hidden");
    $("#system").text("\xB0F");
  }
};

// using leaflet API and openstreetmap tiles drawing the map of the location and adds layers
//  of diffrent weather information from openweathermap API maps 1.0
function ChangeMap(n, lat, lon) {
  let choice;
  if (n === 1) {
    choice = $("#layer").val();
  } else {
    choice = "precipitation_new";
  }
  $("#mapDiv").html('');
  $("#mapDiv").append('<div id="mapid"></div>');
  const myzoom = 13;
  const mymap = L.map('mapid').setView([lat, lon], myzoom);
  const attribution =
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tiles = L.tileLayer(tileURL, { attribution });
  tiles.addTo(mymap);
  L.marker([lat, lon]).addTo(mymap);
  let mapURL = `https://tile.openweathermap.org/map/${choice}/{z}/{x}/{y}.png?appid=${apikey}`
  const attribution1 =
    '&copy; <a href="http://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors';
  const tileRain = L.tileLayer(mapURL, { attribution });
  tileRain.addTo(mymap);
}
// displaying the cities 
function drawCities() {
  citiesFromStorage();
  $(".cities-group").html("");
  for (var i = 0; i < cities.length; i++) {
    var a = $("<div class='row' style='width:100%'>");
    a.append(`<div class="col-10"><figure class="city_clk" id="city_${cities.length}">${cities[i].name}</figure></div>`);
    // adds delete button for every appointment
    a.append('<div class="col-2" style="padding:0"><button class="smBtn" id="smBtn' + i + '">&times;</button></div>');
    // Adding the button to the btn-group div
    $(".cities-group").prepend(a);
    // Adding a data-attribute
    $("#city_" + cities.length).attr("data-name", cities[i].lat + "," + cities[i].lon);
  }
}
// accordingly to the coordinates take information from openweathermap API
function weatherConditions(coord) {
  var queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&units=imperial&exclude=minutely,hourly&appid=${apikey}`;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    $("#bigPan3").css("opacity", 1);
    // https://openweathermap.org/img/w/50d.png
    // '01d''01n','02d''02n''03d''03n''04d''04n'    '09d''09n'   '10d''10n'   '11d''11n'   '13d''13n'   '50d''50n' fog
    // if sucsessfull it find image for the background accordingly to current weather conditions from rapidapi API
    
    var weatherpicURL=`https://pixabay.com/api/?key=17409987-87acf859f9545b0f00c73cdd0&q=${response.current.weather[0].description}&image_type=photo&per_page=10`
    $.ajax({
      url: weatherpicURL,
      method: "GET",
    }).then(function (response1) {
      imgURL = response1.hits[Math.floor(Math.random()*response1.hits.length)].largeImageURL;
      document.body.style.backgroundImage = `url("${imgURL}")`;
    }).catch(function (error) {
      // if error use default
      document.body.style.backgroundImage = `url("${imgURL}")`;
    });
    // another API
    // var settings = {
    //   "async": true,
    //   "crossDomain": true,
    //   "url": `https://bing-image-search1.p.rapidapi.com/images/search?q=${response.current.weather[0].description}`,
    //   "method": "GET",
    //   "headers": {
    //     "x-rapidapi-host": "bing-image-search1.p.rapidapi.com",
    //     "x-rapidapi-key": "dff8f3f117msh752eb83c0d81eb8p10add3jsn52664fe1c35d"
    //   }
    // }

    // $.ajax(settings).done(function (response1) {
    //   imgURL = response1.value[0].contentUrl;
    //   document.body.style.backgroundImage = `url("${imgURL}")`;
    //   console.log(imgURL);
    // }).catch(function (error) {
    //   // if error use default
    //   document.body.style.backgroundImage = `url("${imgURL}")`;
    // });


    // cloudy.jpg
    document.body.style.backgroundRepeat = "y-repeat";
    document.body.style.backgroundSize = "100%";
    // displaying and arranging current weather data in Farengeit and Celcious

    let el = `<button class="systemBtn" id="system" onclick="changeSystem()">&degF</button>
    <h5 class="systemBtn">Change system &degF or &degC :</h5>
    <h2 id="cityName">${coord.name}</h2>
<h3 id="todayDate">${moment().format("dddd LL")}</h3>
<div class="row" id="bigPan2">
  <div class="col-12 col-md-4">
    <h3>Current conditions: <span id="weather">${response.current.weather[0].description}</span></h3>
    <img id="cloudIcon" src="https://openweathermap.org/img/w/${response.current.weather[0].icon}.png" alt="Current Cloud coverage" width="100%">
    <figure id="imp1">
      <h5>Temperature: <span class="curtemp">${Math.round(response.current.temp)}\xB0F</span></h5>
      <h5 class="tempFeel">Feels like: ${Math.round(response.current.feels_like)}\xB0F</h5>
      <p class="tempH">High: ${Math.round(response.daily[0].temp.max)} \xB0F</p>
      <p class="tempL">Low:${Math.round(response.daily[0].temp.min)} \xB0F </p>
      <p class="wind">Wind: ${getWindDir(response.current.wind_deg)}${response.current.wind_speed}mph</p>
    </figure>
    <figure class="hidden" id="metr1">
      <h5>Temperature: <span class="curtemp">${Math.round((response.current.temp - 32) * 5 / 9)}\xB0C</span></h5>
      <h5 class="tempFeel">Feels like: ${Math.round((response.current.feels_like - 32) * 5 / 9)}\xB0C</h5>
      <p class="tempH">High: ${Math.round((response.daily[0].temp.max - 32) * 5 / 9)} \xB0C</p>
      <p class="tempL">Low:${Math.round((response.daily[0].temp.min - 32) * 5 / 9)} \xB0C </p>
      <p class="wind">Wind: ${getWindDir(response.current.wind_deg)}${(response.current.wind_speed / 2.237).toFixed(2)}m/s</p>
    </figure>
    <p id="humidity">Humidity: ${response.current.humidity} %</p>
    <p id="ultraViolet">UV Index: <span id="uv">${response.current.uvi}</span></p>
  </div>
  <div class="col-12 col-md-8">
  <label for="layer">Choose a layer:</label>
  <select name="layer" id="layer" onchange="ChangeMap(1,${coord.lat},${coord.lon})">
    <option value="precipitation_new">Precipitation</option>
    <option value="clouds_new" onselect>Clouds</option>    
    <option value="pressure_new">Sea level pressure</option>
    <option value="wind_new">Wind speed</option>
    <option value="temp_new">Temperature</option>
  </select>
     <div id="mapDiv">  
      
     </div>
     </div>
  </div>
</div>`
    let $currentEl = document.createElement('div');
    $currentEl.innerHTML = el;
    $("#currentPan").empty()
    $("#currentPan").append($currentEl)
    getUVIndexColor(response.current.uvi);
    // cities from storage
    drawCities();
    // adding map
    ChangeMap(0, coord.lat, coord.lon);
    let elM="";

    // displaying and arranging weather data in Farengeit and Celcious for 5 days ahead
    if ($("div.container").width() > 484) {
      el = `<div id="imp2">
      <div class="row justify-content-around" id="rowFor1">           
      `
      elM = `<div class="hidden" id="metr2">
      <div class="row justify-content-around" id="rowFor2">               
      `
      for (var i = 1; i < 6; i++) {
        el +=
          ` <div class="col-2" style="background-color:royalblue; color: whitesmoke; text-align: center; margin:auto; border-radius: 5px">
             <p class="date">${moment().add(i, 'd').format('MMM DD')}</p>
             <img class="cloudIcon" src="https://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png" alt="Cloud coverage">
             <p class="futureData">${response.daily[i].weather[0].main}</p>
             <h6 class="futureData">High:${response.daily[i].temp.max.toFixed(0)}\xB0F</h6>
             <h6 class="futureData">Low:${response.daily[i].temp.min.toFixed(0)}\xB0F</h6>      
             <p class="futureData">Humid. ${response.daily[i].humidity}%</p>
           </div>`
        elM +=
          ` <div class="col-2" style="background-color:royalblue; color: whitesmoke; text-align: center; margin: auto; border-radius: 5px ">         
             <p class="date">${moment().add(i, 'd').format('MMM DD')}</p>
             <img class="cloudIcon" src="https://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png" alt="Cloud coverage ">
             <p class="futureData">${response.daily[i].weather[0].main}</p>
             <h6 class="futureData">High:${Math.round((response.daily[i].temp.max - 32) * 5 / 9)}\xB0C</h6> 
             <h6 class="futureData">Low:${Math.round((response.daily[i].temp.min - 32) * 5 / 9)}\xB0C</h6>
             <p class="futureData">Humid. ${response.daily[i].humidity}%</p>
            </div>`
      }
    }else{
      el = `<div id="imp2">
      <div class="row" id="rowFor1" style="background-color:royalblue; color: whitesmoke; text-align: left; margin:auto;" >           
      `
      elM = `<div class="hidden" id="metr2">
      <div class="row" id="rowFor2" style="background-color:royalblue; color: whitesmoke; text-align: left; margin:auto">               
      `
      for (var i = 1; i < 6; i++) {
        el +=
          ` 
            <div class="col-6" style="text-align: left">
              <p class="date">${moment().add(i, 'd').format('MMM DD')}</p>   
              <h6 class="futureData">High:${response.daily[i].temp.max.toFixed(0)}\xB0F</h6>
              <h6 class="futureData">Low:${response.daily[i].temp.min.toFixed(0)}\xB0F</h6>      
              <p class="futureData">Humid. ${response.daily[i].humidity}%</p>
            </div>
            <div class="col-6" style="text-align: right" >
             <p class="futureData">${response.daily[i].weather[0].main}</p>
             <img class="cloudIcon" style="float:right" src="https://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png" alt="Cloud coverage">
          </div>
          `
        elM +=
          ` 
           <div class="col-6" style="text-align: left" >
             <p class="date">${moment().add(i, 'd').format('MMM DD')}</p>
             <h6 class="futureData">High:${Math.round((response.daily[i].temp.max - 32) * 5 / 9)}\xB0C</h6> 
             <h6 class="futureData">Low:${Math.round((response.daily[i].temp.min - 32) * 5 / 9)}\xB0C</h6>
             <p class="futureData">Humid. ${response.daily[i].humidity}%</p>
          </div>  
          <div class="col-6" style="text-align: right">
            <p class="futureData">${response.daily[i].weather[0].main}</p>
            <img class="cloudIcon" style="float:right" src="https://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png" alt="Cloud coverage">
          </div> `
      }
    }
    el += "</div> </div>";
    $currentEl = document.createElement('div');
    $currentEl.innerHTML = el;
    // $currentEl = $currentEl.firstElementChild;
    $("#forPan").empty();
    $("#forPan").append($currentEl);
    elM += "</div> </div>";
    $currentEl = document.createElement('div');
    $currentEl.innerHTML = elM;
    $("#forPan").append($currentEl)
  });
};
// This function handles events where one button is clicked when inputing city name
$("#add-city").on("click", function (event) {
  event.preventDefault();
  cityInfo.name = $("#city-input").val().trim();
  $("#city-input").val("");
  // callback to openweathermap API to find coordinates of the city
  var locatequeryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInfo.name + '&appid=' + apikey;
  $.ajax({
    url: locatequeryURL,
    method: "GET",
  }).then(function (response) {
    cityInfo.lat = response.coord.lat;
    cityInfo.lon = response.coord.lon;
    // if sucsessful it add city with coordinates to LocalStorage and list of the cities on display
    var a = $("<div class='row'>");
    a.append(`<div class="col-10"><p class="city_clk" id="city_${cities.length}">${cityInfo.name}</p></div>`);
    // adds delete button for every city
    a.append('<div class="col-2"><button class="smBtn" id="smBtn' + cities.length + '">&times;</button></div>');
    // Adding the button to the cities-group div
    $(".cities-group").prepend(a);
    // Adding coordinates to the data-attribute
    $("#city_" + cities.length).attr("data-name", cityInfo.lat + "," + cityInfo.lon);
    cities.push(cityInfo);
    storeCities();
    weatherConditions(cityInfo);
  }).catch(function (error) {
    if (error.status === 404) {
      alert(`uh-oh! Looks like you formatted your city name incorrectly or that city does not exist. \n\n For example: \n ❤️ correct: new york,usa \n ✖️ incorrect: new york,ny`);
    }
    // if city name not found it alerts the user
  });
});
// function for deleting city name from the list of stored cities
$(document).on("click", ".smBtn", function (event) {
  var coor = event.target.id;
  var pos = parseInt(coor.slice(5));
  cities.splice(pos, 1);
  storeCities();
  drawCities();
});
// function calls the weather conditions after clicking on city name
$(document).on("click", ".city_clk", function (event) {
  var coor = $(event.target).attr("data-name");
  var pos = coor.search(",");
  cityInfo.lat = coor.slice(0, pos);
  cityInfo.lon = coor.slice(pos + 1);
  cityInfo.name = $(event.target).text()
  weatherConditions(cityInfo);
});

// call the saved cities
drawCities();