// app.js

const API_KEY = '4b198f93b27f5fc6d89a1149943868eb'; // Replace 'your_api_key' with your actual API key
const form = document.getElementById('search-form');
const weatherInfo = document.getElementById('weather-info');
const historyList = document.getElementById('history-list');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form submission
  const cityInput = document.getElementById('city-input');
  const cityName = cityInput.value.trim();

  if (cityName === '') {
    alert('Please enter a city name.');
    return;
  }

  try {
    const weatherData = await fetchWeatherData(cityName);
    displayWeatherData(weatherData);
    addToSearchHistory(cityName);
    cityInput.value = ''; // Clear input field after search
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather data. Please try again later.');
  }
});

async function fetchWeatherData(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

function displayWeatherData(weatherData) {
  const { name, weather, main, wind, dt } = weatherData;
  const { icon, description } = weather[0];
  const { temp, humidity } = main;
  const { speed } = wind;
  const currentDate = new Date(dt * 1000); // Convert Unix timestamp to milliseconds

  const weatherHTML = `
    <h2>${name}</h2>
    <p>Date: ${currentDate.toDateString()}</p>
    <p>Description: ${description}</p>
    <p>Temperature: ${temp}°C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${speed} m/s</p>
    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
  `;
  weatherInfo.innerHTML = weatherHTML;
}

function addToSearchHistory(cityName) {
  const listItem = document.createElement('li');
  listItem.textContent = cityName;
  historyList.appendChild(listItem);
  
  // Add click event listener to the new search history item
  listItem.addEventListener('click', async () => {
    try {
      const weatherData = await fetchWeatherData(cityName);
      displayWeatherData(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Failed to fetch weather data. Please try again later.');
    }
  });
}
