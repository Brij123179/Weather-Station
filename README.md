# Weather Dashboard Application

Welcome to the Weather Dashboard Application! This project is built as part of the "Week 6: Advanced JavaScript & APIs" curriculum. It fetches current weather and 5-day forecasts from the OpenWeatherMap API, demonstrating asynchronous JavaScript, API integrations, error handling, and local storage persistence.

## 🎯 Project Overview

This modern weather dashboard allows users to dynamically search for atmospheric conditions anywhere in the world. It provides real-time data seamlessly while remembering the user's preferred settings such as default city search, visual theme, and preferred measurement units.

**Key Features:**
- **Real-Time Weather Data:** Fetches the latest atmospheric conditions including temperature, humidity, wind speed, visibility, and pressure.
- **5-Day Forecast:** Previews mid-day weather predictions for the next 5 days.
- **Instant Search with Debouncing:** Automatically updates the weather dashboard without needing a search button using a debounced input tracker that limits excessive API calls (800ms).
- **Recent Search History:** Accessible auto-suggestions using local storage.
- **Dynamic Theme Toggling:** Support for high-contrast dark mode and clean light mode interfaces.
- **Measurement Preferences:** Toggle easily between Imperial (°F, mph) and Metric (°C, km/h) units.
- **Resilient UI:** Premium glassmorphism UI with responsive grid layouts, gracefully handled loading states, and user-friendly error messages when things go wrong.

---

## 💻 Tech Stack & API

- **Core:** HTML5, CSS3, Vanilla JavaScript (ES Modules).
- **Fonts:** Modern Outfit from Google Fonts.
- **Data Source:** [OpenWeatherMap API](https://openweathermap.org/api) (`weather` and `forecast` resources).

---

## 🛠️ Setup & Installation

To run this application, you must follow these steps to add your personal OpenWeatherMap API Key.

1. Create a free account at [OpenWeatherMap](https://openweathermap.org/api).
2. Generate an API Key under your account settings.
3. Open `js/api.js` in your code editor.
4. Replace the constant placeholder string on line 2 with your real API key:

```javascript
// Replace this with a real OpenWeatherMap API key
const API_KEY = 'your_api_key_here'; 
```

5. Serve the project directly using an HTTP Server (e.g., VSCode Live Server).
   > **Note:** Because this project uses JavaScript ES Modules (`import/export`), you must use a local development server to run it. Simply opening the `index.html` file via the `file://` protocol will result in a CORS error.

---

## 📁 Repository Structure

```plaintext
/
├── index.html           # Main semantic markup
├── css/
│   └── styles.css       # Layouts, variables, and dark mode configuration
├── js/
│   ├── api.js           # API interaction layer, containing async fetch functions
│   ├── app.js           # DOM controllers, event listeners, and debouncing
│   └── storage.js       # Local Storage utilities (preferences and history)
├── README.md            # Project comprehensive documentation
└── screenshots/         # Directory to hold graphical documentation of the app
```

### Module Breakdown

- **`api.js`:** Handles robust connection to OpenWeatherMap REST endpoints. Throws descriptive errors on failure (404/401 HTTP codes) ensuring the UI can present legible alerts.
- **`app.js`:** Central execution file managing asynchronous promises out of `api.js` to render views dynamically. The search event listener runs a `setTimeout` debounce function to delay fetches intentionally until typing has stopped.
- **`storage.js`:** Separates persistence concerns handling JSON parsing and writing for the theme options, selected units, and search cache keys preventing side-effects on the DOM context.

---

## 📚 Technical Learning Highlights

This project checks off the fundamental criteria from the learning week:

1. **Async / Await Integration:** Used robust standard promise-handling with try/catch wrapping API fetches.
2. **Local Storage:** Stores complex `Object` preferences parsed and stringified seamlessly to `localStorage`.
3. **Debounced Search:** Avoids API rate-limiting via setTimeout logic preventing continuous keypress events from overloading fetching queues.
4. **Error Handling:** Designed to gracefully render a dedicated error container instead of breaking silently. 

*Enjoy tracking the weather smoothly!*
