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

  console.log(getWeatherData);