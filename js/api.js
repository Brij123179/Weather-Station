// API configuration
const API_KEY = 'your_api_key_here'; // Replace this with your valid OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather data
 * @param {string} city - The city name
 * @param {string} units - metric or imperial
 * @returns {Promise<Object>} Formatted weather data
 */
export async function fetchWeatherData(city, units = 'metric') {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${units}`
        );
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API Key. Please add a valid OpenWeatherMap API key in js/api.js');
            } else if (response.status === 404) {
                throw new Error(`City "${city}" not found. Please try another search.`);
            }
            throw new Error(`Weather data unavailable (${response.status})`);
        }
        
        const data = await response.json();
        return {
            city: data.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: (units === 'metric' ? data.wind.speed * 3.6 : data.wind.speed).toFixed(1), // convert m/s to km/h if metric
            visibility: (data.visibility / 1000).toFixed(1), // convert to km
            pressure: data.main.pressure,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
            dt: data.dt * 1000 // Convert unix timestamp to ms
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

/**
 * Fetch 5-day weather forecast
 * @param {string} city - The city name
 * @param {string} units - metric or imperial
 * @returns {Promise<Array>} Array of 5 daily forecast objects
 */
export async function fetchForecastData(city, units = 'metric') {
    try {
        const response = await fetch(
            `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${units}`
        );
        
        if (!response.ok) {
             if (response.status === 401) {
                throw new Error('Invalid API Key. Please add a valid OpenWeatherMap API key in js/api.js');
            }
            throw new Error(`Forecast data unavailable (${response.status})`);
        }
        
        const data = await response.json();
        
        // Data contains 3-hour intervals for 5 days (40 items).
        // We only want 1 representation per day, roughly mid-day.
        const dailyForecasts = [];
        const seenDates = new Set();
        
        for (const item of data.list) {
            const dateObj = new Date(item.dt * 1000);
            const dateStr = dateObj.toLocaleDateString();
            
            // Aim for timestamps between 12:00 and 15:00 for the daily max temp roughly
            const hour = dateObj.getHours();
            
            if (!seenDates.has(dateStr)) {
                // To be robust, grab the first record traversing mid-day, OR fallback to whatever is first for that day
                if (hour >= 11 || !data.list.find((d) => { 
                    const h = new Date(d.dt * 1000).getHours();
                    return new Date(d.dt * 1000).toLocaleDateString() === dateStr && h >= 11 && h <= 15;
                })) {
                    seenDates.add(dateStr);
                    dailyForecasts.push({
                        date: dateObj,
                        temp: Math.round(item.main.temp),
                        description: item.weather[0].description,
                        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
                    });
                }
            }
            if (dailyForecasts.length >= 5) break; 
        }

        return dailyForecasts;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error; // Let app.js handle rendering the error
    }
}
