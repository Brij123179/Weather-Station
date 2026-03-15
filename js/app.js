import { fetchWeatherData, fetchForecastData } from './api.js';
import { 
    loadUserPreferences, 
    saveUserPreferences, 
    saveSearchHistory, 
    loadSearchHistory, 
    clearSearchHistory 
} from './storage.js';

// DOM Elements
const body = document.body;
const searchInput = document.getElementById('city-search');
const searchHistoryDropdown = document.getElementById('search-history');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const unitToggleBtns = document.querySelectorAll('.unit-btn');

// State Containers
const loadingState = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');
const errorText = document.getElementById('error-text');
const dashboard = document.getElementById('dashboard');

// Current Weather Elements
const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const currentIconEl = document.getElementById('current-icon');
const currentTempEl = document.getElementById('current-temp');
const currentDescEl = document.getElementById('current-description');
const humidityEl = document.getElementById('current-humidity');
const windEl = document.getElementById('current-wind');
const visibilityEl = document.getElementById('current-visibility');
const pressureEl = document.getElementById('current-pressure');

// Forecast Container
const forecastContainer = document.getElementById('forecast-container');

// App Initialization
let appState = loadUserPreferences();
let debounceTimer;

// Init App
function initApp() {
    applyTheme(appState.theme);
    applyActiveUnitBtn(appState.units);
    
    // Attempt loading the default city
    fetchAndRenderWeather(appState.defaultCity);
}

// ---------------------------
// 1. Data Fetching & Rendering
// ---------------------------
async function fetchAndRenderWeather(city) {
    if (!city || city.trim() === '') return;
    
    // Manage UI States
    showLoading();
    
    try {
        const [weatherData, forecastData] = await Promise.all([
            fetchWeatherData(city, appState.units),
            fetchForecastData(city, appState.units)
        ]);
        
        // Update App City State and save
        appState.defaultCity = weatherData.city;
        saveUserPreferences(appState);
        saveSearchHistory(weatherData.city);
        
        // Render
        renderCurrentWeather(weatherData);
        renderForecast(forecastData);
        showDashboard();
    } catch (error) {
        showError(error.message);
    }
}

// Render Current Weather
function renderCurrentWeather(data) {
    cityNameEl.textContent = `${data.city}, ${data.country}`;
    
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    currentDateEl.textContent = new Date(data.dt).toLocaleDateString(undefined, dateOpts);
    
    currentIconEl.src = data.icon;
    currentTempEl.textContent = `${data.temperature}°`;
    currentDescEl.textContent = data.description;
    
    humidityEl.textContent = `${data.humidity}%`;
    
    // Wind unit based on metric or imperial
    const speedUnit = appState.units === 'metric' ? 'km/h' : 'mph';
    windEl.textContent = `${data.windSpeed} ${speedUnit}`;
    
    // Visibility unit
    const distUnit = appState.units === 'metric' ? 'km' : 'mi';
    visibilityEl.textContent = `${data.visibility} ${distUnit}`;
    
    pressureEl.textContent = `${data.pressure} hPa`;
}

// Render 5-day Forecast
function renderForecast(forecastArray) {
    forecastContainer.innerHTML = ''; // Selectively empty
    
    forecastArray.forEach(day => {
        const card = document.createElement('div');
        card.className = 'forecast-card glass-panel';
        
        // Short day name
        const dayName = new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' });
        
        card.innerHTML = `
            <div class="forecast-date">${dayName}</div>
            <img class="forecast-icon" src="${day.icon}" alt="${day.description}">
            <div class="forecast-temp">${day.temp}°</div>
            <div class="forecast-desc" style="font-size:0.8rem; color:var(--text-secondary); text-transform:capitalize;">${day.description}</div>
        `;
        
        forecastContainer.appendChild(card);
    });
}

// ---------------------------
// 2. Debounced Search Feature
// ---------------------------
searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    
    // Update Recent Searches UI if typing is empty
    if (!value) {
        renderSearchHistory();
        return;
    } else {
        searchHistoryDropdown.classList.add('hidden');
    }
    
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchAndRenderWeather(value);
    }, 800); // 800ms debounce
});

searchInput.addEventListener('focus', () => {
    if (!searchInput.value) renderSearchHistory();
});

// Close history dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchHistoryDropdown.contains(e.target)) {
        searchHistoryDropdown.classList.add('hidden');
    }
});

// History Render
function renderSearchHistory() {
    const history = loadSearchHistory();
    historyList.innerHTML = '';
    
    if (history.length > 0) {
        searchHistoryDropdown.classList.remove('hidden');
        history.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', () => {
                searchInput.value = city;
                searchHistoryDropdown.classList.add('hidden');
                fetchAndRenderWeather(city);
            });
            historyList.appendChild(li);
        });
    } else {
        searchHistoryDropdown.classList.add('hidden');
    }
}

clearHistoryBtn.addEventListener('click', () => {
    clearSearchHistory();
    renderSearchHistory();
});

// ---------------------------
// 3. Theme & Units Controls
// ---------------------------
themeToggle.addEventListener('click', () => {
    const newTheme = appState.theme === 'light' ? 'dark' : 'light';
    appState.theme = newTheme;
    saveUserPreferences(appState);
    applyTheme(newTheme);
});

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.replace('light-mode', 'dark-mode');
        body.classList.add('dark-mode'); // Fallback
        body.classList.remove('light-mode');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        body.classList.add('light-mode'); // Fallback
        body.classList.remove('dark-mode');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    }
}

unitToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const unit = e.target.getAttribute('data-unit');
        if (unit !== appState.units) {
            appState.units = unit;
            saveUserPreferences(appState);
            applyActiveUnitBtn(unit);
            // Re-fetch using new unit if we already have a city
            const q = searchInput.value || appState.defaultCity;
            if (q) fetchAndRenderWeather(q);
        }
    });
});

function applyActiveUnitBtn(unit) {
    unitToggleBtns.forEach(btn => {
        if (btn.getAttribute('data-unit') === unit) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ---------------------------
// 4. UI View States
// ---------------------------
function showLoading() {
    loadingState.classList.remove('hidden');
    dashboard.classList.add('hidden');
    errorContainer.classList.add('hidden');
}

function showDashboard() {
    loadingState.classList.add('hidden');
    dashboard.classList.remove('hidden');
    errorContainer.classList.add('hidden');
}

function showError(msg) {
    loadingState.classList.add('hidden');
    dashboard.classList.add('hidden');
    errorContainer.classList.remove('hidden');
    errorText.textContent = msg;
}

// Start Program
document.addEventListener('DOMContentLoaded', initApp);
