# Synent Technologies Web Development Internship - Task 6
## API Integration Project (Weather Dashboard)

### 🔗 Project Links
- **Live Demo:** [https://weatherdashwd.netlify.app/](https://weatherdashwd.netlify.app/)
- **GitHub Repository:** [https://github.com/Brij123179/Weather-Station](https://github.com/Brij123179/Weather-Station) *(Note: Rename repository to `synent-task6-weatherapp-brij` for submission)*
- **Demonstration Video:** *[Insert Video Link Here]*
- **LinkedIn Post:** [https://www.linkedin.com/feed/update/urn:li:activity:7468782377180491778/](https://www.linkedin.com/feed/update/urn:li:activity:7468782377180491778/)

### Objective
Fetch and display data from a public API dynamically, incorporating loading states and error handling.

### Project Overview
The Weather Dashboard Application is a modern, high-performance web app that asynchronously fetches global meteorological data from the OpenWeatherMap API.
The core objectives of the application include:
*   Providing live Current Weather and a 5-Day Forecast dynamically.
*   Retaining user settings (themes, search history, unit preferences) across sessions using Local Storage.
*   Optimizing API calls with debouncing logic for the search feature.
*   Ensuring a premium, responsive glassmorphism UI capable of error handling dynamically without breaking.

### Features Implemented
* **API Integration:** Fetches real-time weather and 5-day forecast data from OpenWeatherMap using the Fetch API and `async/await`.
* **Dynamic Display:** Renders data directly onto the UI, mapping variables like Unix timestamps to Date objects.
* **Error Handling:** Implements comprehensive `try/catch` blocks. Catches `401 Unauthorized` for missing API keys and `404 Not Found` for invalid cities, displaying user-friendly error messages instead of breaking the app.
* **Loading State:** Shows feedback to the user while data is being fetched to ensure a smooth user experience.
* **Local Storage:** Persists search history (last 5 cities) and user preferences (theme, units).

### Setup and Installation Instructions
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

### Code Structure
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

### Visual Documentation
> *Please place screenshots of your application in the `/screenshots` directory in the repository.*
*   **Main Dashboard (Light Mode):** `screenshots/light_dashboard.png` - Demonstrates current weather grid and forecast list.
*   **Main Dashboard (Dark Mode):** `screenshots/dark_dashboard.png` - Demonstrates UI reactivity to the dark mode toggle.
*   **Error Handling UI:** `screenshots/error_state.png` - Demonstrates the visual fallback when an API Key is missing or a city is invalid.
*   **Search History Component:** `screenshots/search_history.png` - Demonstrates local storage saving the last 5 searched cities.

### ✅ Submission Requirements Checklist
- [x] Fetch and display data from a public API (Weather API)
- [x] Use Fetch API in JavaScript
- [x] Display data dynamically
- [x] Loading state included
- [x] Error handling included
- [x] Minimum 5 meaningful commits on GitHub
- [ ] Demonstration video (1-3 minutes, explaining features and working)
- [x] Share on LinkedIn tagging @Synent Technologies with hashtags `#internship` `#webdevelopment` `#learning` `#technology`
- [ ] Submit repository and video links via the provided email
