# Weather Dashboard Application Documentation

This repository contains the Weather Dashboard Application, built as part of the "Week 6: Advanced JavaScript & APIs" curriculum.

---

## 📋 Documentation Requirements
This document fulfills the complete guidelines for the project submission, covering API integration, async JavaScript runtime logic, robust data handling, and local storage state persistence.

---

## 1. Project Overview
**Goals and Objectives**
The goal of this project is to build a modern, high-performance weather dashboard that asynchronously fetches global meteorological data from a 3rd party public API.
The core objectives of the application include:
*   Providing live Current Weather and a 5-Day Forecast dynamically.
*   Retaining user settings (themes, search history, unit preferences) across sessions using Local Storage.
*   Optimizing API calls with debouncing logic for the search feature.
*   Ensuring a premium, responsive glassmorphism UI capable of error handling dynamically without breaking.

---

## 2. Setup Instructions
**Step-by-Step Installation and Configuration Guide**

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Brij123179/Weather-Station.git
    cd Weather-Station
    ```
2.  **Acquire API Credentials**
    *   Create a free account at [OpenWeatherMap](https://openweathermap.org/api).
    *   Navigate to your account settings and generate a standard API Key.
    *   *Note: newly generated keys can take up to 2 hours to activate from OpenWeatherMap's servers.*
3.  **Configure API Key**
    *   Open the `/js/api.js` file.
    *   Locate the `API_KEY` constant at the top of the file:
        ```javascript
        const API_KEY = 'your_api_key_here'; // Replace this
        ```
    *   Replace the placeholder `'your_api_key_here'` with your newly generated 32-character API key string.
4.  **Run the Project**
    *   Since this project uses JavaScript ES Modules (`import/export`), you **must** serve the files over an HTTP Server (e.g., VSCode Live Server or `npx http-server`).
    *   Running the `.html` file simply via double-clicking (the `file://` protocol) will result in CORS module errors.

---

## 3. Code Structure
**File Hierarchy and Organization**

The application leverages a modular frontend architecture keeping view logic, state storage, and external I/O strictly decoupled.

```plaintext
/
├── index.html           # Main semantic HTML5 markup and SVG declarations
├── css/
│   └── styles.css       # Core layout variables, dark/light theme properties, glassmorphism UI
├── js/
│   ├── api.js           # API interaction layer (I/O) - Handles all async fetch and parameter parsing
│   ├── app.js           # DOM controller - Handles debouncing, data bridging to UI, and Event Listeners
│   └── storage.js       # Persistence layer - Safely reads/writes object data to the Browser's localStorage
├── README.md            # Comprehensive project documentation
└── screenshots/         # Directory to hold graphical documentation captures
    └── .gitkeep
```

---

## 4. Visual Documentation
**Screenshots Demonstrating Functionality**

> *Please place screenshots of your application in the `/screenshots` directory in the repository.*

*   **Main Dashboard (Light Mode):** `screenshots/light_dashboard.png` - Demonstrates current weather grid and forecast list.
*   **Main Dashboard (Dark Mode):** `screenshots/dark_dashboard.png` - Demonstrates UI reactivity to the dark mode toggle.
*   **Error Handling UI:** `screenshots/error_state.png` - Demonstrates the visual fallback when an API Key is missing or a city is invalid.
*   **Search History Component:** `screenshots/search_history.png` - Demonstrates local storage saving the last 5 searched cities.

---

## 5. Technical Details
**Algorithms, Data Structures, and Architecture**

### Fetching Data (Async JavaScript Usage)
*   The application implements ES8 `async/await` syntax to resolve API Promises sequentially. Inside `app.js`, `Promise.all()` is utilized to concurrently fetch the *Current Weather* resource and the *Forecast* resource, decreasing load times.
*   **Data Handling:** Response data streams are actively parsed using `.json()` and are carefully mapped to strict UI properties (e.g., mapping Unix timestamps to Native Date Objects before display). Error handling wraps all external calls in `try/catch` execution blocks.

### Debounce Algorithm (Search)
*   To prevent immediate rate-limiting by the API on user typing, a **Debouncing Algorithm** is used.
*   An `800ms` `setTimeout` timer is defined on the input event. If the user types a new character before `800ms`, `clearTimeout` executes, destroying the previous waiting execution. Fetch commands are only fired when the user *pauses* for over `800ms`.

### Local Storage Implementation
*   **Data Structure:** Settings are maintained via JavaScript Objects caching default strings. They are stringified into JSON and persisted natively.
*   **Architecture:** `storage.js` acts explicitly as a safe wrapper, running `try/catch` logic over all `setItem` / `getItem` requests to prevent breaking local storage issues.

---

## 6. Testing Evidence
**Examples of Validation and Edge Case Handling**

### Test Plan & Passed Scenarios:
1.  **Test Case: Missing or Invalid API Key**
    *   *Action:* Clear the API value to an empty string or send a malformed API key in `api.js`.
    *   *Validation Result:* Application successfully caught `401 Unauthorized`. Prevented a white-screen crash. Displayed user-friendly center-screen message telling the user to insert a valid key.
2.  **Test Case: Search for Non-existent City**
    *   *Action:* Search for arbitrary string (e.g., "zzzaaabbb").
    *   *Validation Result:* Application caught `404 Not Found`. Bypassed DOM population, rendering UI error message instead.
3.  **Test Case: Local Storage Refresh Test**
    *   *Action:* Load a specific city, switch to Dark theme, switch to Imperial units. Refresh the page manually (`F5`).
    *   *Validation Result:* Application loaded initial state identical to pre-refresh configurations globally.

---

## 7. API Documentation
**Complete Endpoint Specifications with Examples**

The project relies on two Core endpoints from OpenWeatherMap.

### Endpoint 1: Current Weather Data
*   **URL:** `GET https://api.openweathermap.org/data/2.5/weather`
*   **Parameters:**
    *   `q` (string): The city name string (e.g., `London`).
    *   `units` (string): Standard, `metric`, or `imperial`.
    *   `appid` (string): 32-character developer key.
*   **Sample Response Data Utilized:**
    ```json
    {
      "weather": [{"description": "clear sky", "icon": "01d"}],
      "main": {"temp": 15.5, "pressure": 1012, "humidity": 70},
      "visibility": 10000,
      "wind": {"speed": 4.1},
      "dt": 1661870592,
      "sys": {"country": "GB"},
      "name": "London"
    }
    ```

### Endpoint 2: 5 Day / 3 Hour Forecast
*   **URL:** `GET https://api.openweathermap.org/data/2.5/forecast`
*   **Parameters:** Exact same required params as the current weather endpoint.
*   **Response Handling Architecture:** Instead of exposing 40 individual 3-hour chunks, our data handler loop actively filters the `data.list` array, returning specifically the first data node for every *new day* string traversed around 12:00PM conceptually, condensing a heavy payload into exactly 5 daily representations.
