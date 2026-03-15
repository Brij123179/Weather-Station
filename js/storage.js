// Storage keys
const PREFS_KEY = 'weatherPreferences';
const HISTORY_KEY = 'weatherSearchHistory';

// Default preferences
const DEFAULT_PREFS = {
    defaultCity: 'London',
    units: 'metric',
    theme: 'light' // Matches user request sample
};

// Save user preferences
export function saveUserPreferences(prefs) {
    try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
        console.warn('Could not save preferences to Local Storage:', e);
    }
}

// Load user preferences
export function loadUserPreferences() {
    try {
        const prefs = localStorage.getItem(PREFS_KEY);
        return prefs ? { ...DEFAULT_PREFS, ...JSON.parse(prefs) } : DEFAULT_PREFS;
    } catch (e) {
        console.warn('Could not read preferences from Local Storage:', e);
        return DEFAULT_PREFS;
    }
}

// Save to recent searches array
export function saveSearchHistory(city) {
    try {
        let history = loadSearchHistory();
        // Remove city if it already exists, to move it to top
        history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
        history.unshift(city); // Add to beginning
        // Keep only top 5 recent
        if (history.length > 5) history.pop();
        
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.warn('Could not save history:', e);
    }
}

export function loadSearchHistory() {
    try {
        const history = localStorage.getItem(HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        return [];
    }
}

export function clearSearchHistory() {
    try {
        localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
        console.warn('Could not clear history:', e);
    }
}
