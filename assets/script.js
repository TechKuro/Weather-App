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