// Define variables to store API endpoint URL and API key
const apiEndpoint = 'https://api.openweathermap.org/data/2.5/forecast';
const apiKey = 'c31824c6eff6974b41832872fdace705';

// Define variables to store DOM elements for later use
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const historyList = document.getElementById('history');
const todaySection = document.getElementById('today');
const forecastSection = document.getElementById('forecast');

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

// Define a function to display weather data for today
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
  }
  
  // Define a function to update the history list in the DOM
  function updateHistoryList() {
    // Get the history list from localStorage
    const history = JSON.parse(localStorage.getItem('history'));
    // If no history list exists yet, create an empty array
    if (!history) {
      return;
    }
    // Construct the HTML for the history list
    const html = history.map(city => `
        <button type="button" class="list-group-item list-group-item-action">${city}</button>
      `).join('');
    // Update the DOM with the HTML
    historyList.innerHTML = html;
    // Add event listeners to the history buttons
    const historyButtons = historyList.querySelectorAll('button');
    historyButtons.forEach(button => {
      button.addEventListener('click', () => {
        // When a history button is clicked, retrieve weather data for that city
        const city = button.textContent;
        getWeatherData(city);
      });
    });
  }
  
  // Add event listeners for the search form submission
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    // When the search form is submitted, retrieve weather data for the entered city
    const city = searchInput.value.trim();
    if (!city) {
      return;
    }
    getWeatherData(city);
    // Clear the search input field
    searchInput.value = '';
  });
  
  // Load the history list on page load
  updateHistoryList();
  