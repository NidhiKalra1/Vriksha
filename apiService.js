// API Service Layer for Nominatim Geocoding and Open-Meteo weather forecasts
const APIService = {
  /**
   * Searches for a city, town, or district in India using Nominatim API.
   * Restricts search results specifically to India.
   * @param {string} query The user input query string
   * @returns {Promise<Array>} Array of location objects
   */
  async searchIndianCities(query) {
    if (!query || query.trim().length < 3) return [];

    // We append a custom User-Agent in parameters as requested by Nominatim guidelines to avoid blocking
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=in&limit=8&addressdetails=1`;

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'VrikshaHeatIndexApp/1.0 (India Heat Scale & Tree Plantation Planner)'
        }
      });

      if (!response.ok) {
        throw new Error(`Nominatim search failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Map and clean raw data
      return data.map(item => {
        const address = item.address || {};
        const cityName = address.city || address.town || address.village || address.suburb || address.neighbourhood || address.state_district || item.display_name.split(',')[0];
        const stateName = address.state || '';

        return {
          displayName: item.display_name,
          city: cityName,
          state: stateName,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          importance: item.importance || 0
        };
      });
    } catch (error) {
      console.error("Error fetching geocoding suggestions:", error);
      throw error;
    }
  },

  /**
   * Fetches real weather and meteorological data using Open-Meteo API.
   * @param {number} lat Latitude
   * @param {number} lon Longitude
   * @returns {Promise<Object>} Cleaned weather indicators
   */
  async fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo weather retrieval failed: ${response.statusText}`);
      }

      const data = await response.json();
      const current = data.current || {};

      return {
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature !== undefined ? current.apparent_temperature : current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        // Map WMO weather codes to human-readable strings and Lucide icon aliases
        condition: this._mapWmoCode(current.weather_code)
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  },

  /**
   * Helper: Maps WMO codes to human readable text and basic icons.
   * @private
   */
  _mapWmoCode(code) {
    if (code === 0) return { label: "Clear Sky", icon: "sun" };
    if (code >= 1 && code <= 3) return { label: "Partly Cloudy", icon: "cloud-sun" };
    if (code === 45 || code === 48) return { label: "Foggy", icon: "cloud-fog" };
    if (code >= 51 && code <= 55) return { label: "Drizzle", icon: "cloud-drizzle" };
    if (code >= 61 && code <= 65) return { label: "Rainy", icon: "cloud-rain" };
    if (code >= 71 && code <= 77) return { label: "Snowy", icon: "snowflake" };
    if (code >= 80 && code <= 82) return { label: "Rain Showers", icon: "cloud-showers-heavy" };
    if (code >= 95 && code <= 99) return { label: "Thunderstorm", icon: "cloud-lightning" };
    return { label: "Overcast", icon: "cloud" };
  }
};

window.APIService = APIService;
