// Define variables to store API endpoint URL and API key
const apiEndpoint = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = 'c31824c6eff6974b41832872fdace705';

// Define variables to store DOM elements for later use
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const historyList = document.getElementById('history');
const todaySection = document.getElementById('today');
const forecastSection = document.getElementById('forecast');

console.log(apiKey);

// Define a function to retrieve weather data for a given city
function getWeatherData(city) {
    // Use the OpenWeatherMap API to retrieve the city's coordinates
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const { lat, lon } = data.coord;
        // Use the 5 Day Weather Forecast API to retrieve weather data for the city
        const forecastUrl = `${apiEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        fetch(forecastUrl)
          .then(response => response.json())
          .then(data => {
            // Display weather data for today and the next 5 days
            displayTodayWeather(data.list[0]);
            displayForecastWeather(data.list.slice(1, 6));
            // Save the city to localStorage
            saveToLocalStorage(city);
            // Update the history list
            updateHistoryList();
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }




  function displayTodayWeather(todayWeatherData) {
    // Format the date and time using Moment.js
    const date = moment(todayWeatherData.dt_txt).format('dddd, MMMM Do YYYY');
    const time = moment(todayWeatherData.dt_txt).format('h:mm a');
    // Construct the HTML for the today's weather section
    const html = `
      <h2>${todayWeatherData.name}</h2>
      <p>${date} at ${time}</p>
      <p>${todayWeatherData.weather[0].description}</p>
      <p>Temperature: ${Math.round(todayWeatherData.main.temp - 273.15)} &deg;C</p>
      <p>Humidity: ${todayWeatherData.main.humidity} %</p>
    `;
    // Update the DOM with the HTML
    todaySection.innerHTML = html;
    
  }

// Define a function to display weather data for the next 5 days
function displayForecastWeather(forecastWeatherData) {
    // Construct the HTML for the forecast section
    const html = forecastWeatherData.map(data => {
      // Format the date using Moment.js
      const date = moment(data.dt_txt).format('dddd, MMMM Do YYYY');
      return `
        <div class="col-md-2">
          <p>${date}</p>
          <p>${data.weather[0].description}</p>
          <p>Temperature: ${Math.round(data.main.temp - 273.15)} &deg;C</p>
          <p>Humidity: ${data.main.humidity} %</p>
        </div>
      `;
    }).join('');
    // Update the DOM with the HTML
    forecastSection.innerHTML = `
      <div class="col-md-12"><h2>5-Day Forecast:</h2></div>
      ${html}
    `;
  }
  // Define a function to save a city to localStorage
function saveToLocalStorage(city) {
    // Get the existing history list from localStorage
    let history = localStorage.getItem('history');
    // If no history list exists yet, create an empty array
    if (!history) {
      history = [];
    } else {
      history = JSON.parse(history);
    }
    // Add the new city to the history list
    history.unshift(city);
    // Limit the history list to 5 items
    history = history.slice(0, 5);
    // Save the updated history list back to localStorage
    localStorage.setItem('history', JSON.stringify(history));
    console.log(saveToLocalStorage);
  }
