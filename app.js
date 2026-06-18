// Vriksha Index Core Coordination Module
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const searchInput = document.getElementById('city-search-input');
  const suggestionsDropdown = document.getElementById('suggestions-dropdown');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const popularCitiesContainer = document.getElementById('popular-cities-pills');

  const homeView = document.getElementById('home-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loadingState = document.getElementById('loading-state');
  const errorMessageBanner = document.getElementById('error-message-banner');
  const logoRefresh = document.getElementById('logo-refresh');

  // Dashboard Metrics Nodes
  const heatBadgeContainer = document.getElementById('heat-badge-container');
  const heatLevelLabel = document.getElementById('heat-level-label');
  const heatScoreDisplay = document.getElementById('heat-score-display');

  const cityTitleDisplay = document.getElementById('city-title-display');
  const dateDisplay = document.getElementById('date-display');
  const weatherIconBox = document.getElementById('weather-icon-box');
  const tempMainDisplay = document.getElementById('temp-main-display');
  const tempFeelsDisplay = document.getElementById('temp-feels-display');

  const humidityDisplay = document.getElementById('humidity-display');
  const windDisplay = document.getElementById('wind-display');

  // Accordion Nodes
  const accordionTrigger = document.getElementById('accordion-trigger');
  const accordionBody = document.getElementById('accordion-body');
  const accordionArrow = document.getElementById('accordion-arrow');

  // Planner Nodes
  const coolingSlider = document.getElementById('cooling-slider');
  const sliderTargetVal = document.getElementById('slider-target-val');
  const metricTreesCount = document.getElementById('metric-trees-count');
  const metricHeatDrop = document.getElementById('metric-heat-drop');
  const zonesBreakdownList = document.getElementById('zones-breakdown-list');

  // Map state
  let leafletMapInstance = null;
  let mapMarkersLayerGroup = null;

  // Active City Weather details state
  let currentCityData = null;
  let currentWeatherState = null;
  let searchDebounceTimeout = null;

  // Initialize UI components
  init();

  function init() {
    // Render Quick Search Pills
    renderPopularCities();

    // Event Bindings
    searchInput.addEventListener('input', handleSearchInput);
    clearSearchBtn.addEventListener('click', handleClearSearch);

    // Hide dropdown if clicked outside search
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsDropdown.contains(e.target)) {
        hideSuggestions();
      }
    });

    // Slider listener
    coolingSlider.addEventListener('input', handleSliderChange);

    // Accordion trigger
    accordionTrigger.addEventListener('click', toggleAccordion);

    // Logo refresh click
    logoRefresh.addEventListener('click', resetToHomeView);

    // Lucide setup
    lucide.createIcons();
  }

  // --- UI Layout state toggles ---

  function resetToHomeView() {
    currentCityData = null;
    currentWeatherState = null;
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    hideSuggestions();
    hideErrorBanner();

    dashboardView.classList.add('hidden');
    loadingState.classList.add('hidden');
    homeView.classList.remove('hidden');
  }

  function showLoadingState() {
    hideErrorBanner();
    homeView.classList.add('hidden');
    dashboardView.classList.add('hidden');
    loadingState.classList.remove('hidden');
  }

  function showDashboardState() {
    loadingState.classList.add('hidden');
    homeView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
  }

  function showErrorBanner(msg) {
    errorMessageBanner.textContent = msg;
    errorMessageBanner.classList.remove('hidden');
    loadingState.classList.add('hidden');
  }

  function hideErrorBanner() {
    errorMessageBanner.classList.add('hidden');
  }

  // --- Autocomplete Suggestions & Searches ---

  function renderPopularCities() {
    popularCitiesContainer.innerHTML = '';
    window.CONFIG.POPULAR_CITIES.forEach(city => {
      const button = document.createElement('button');
      button.className = 'city-pill';
      button.textContent = `${city.name}, ${city.state}`;
      button.addEventListener('click', () => {
        searchInput.value = city.name;
        clearSearchBtn.classList.remove('hidden');
        executeCitySelect(city);
      });
      popularCitiesContainer.appendChild(button);
    });
  }

  function handleSearchInput(e) {
    const val = e.target.value;

    if (val.trim().length > 0) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }

    clearTimeout(searchDebounceTimeout);

    if (val.trim().length < 3) {
      hideSuggestions();
      return;
    }

    searchDebounceTimeout = setTimeout(async () => {
      try {
        const locations = await window.APIService.searchIndianCities(val);
        displaySuggestions(locations);
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
      }
    }, 300);
  }

  function handleClearSearch() {
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    hideSuggestions();
    hideErrorBanner();
  }

  function displaySuggestions(locations) {
    if (!locations || locations.length === 0) {
      suggestionsDropdown.innerHTML = '<div class="suggestion-item"><span class="suggestion-city">No matching locations found in India</span></div>';
      suggestionsDropdown.style.display = 'block';
      return;
    }

    suggestionsDropdown.innerHTML = '';
    locations.forEach(loc => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';

      const title = document.createElement('span');
      title.className = 'suggestion-city';
      title.textContent = loc.city;

      const details = document.createElement('span');
      details.className = 'suggestion-state';
      details.textContent = loc.displayName;

      item.appendChild(title);
      item.appendChild(details);

      item.addEventListener('click', () => {
        searchInput.value = `${loc.city}, ${loc.state}`;
        hideSuggestions();
        executeCitySelect(loc);
      });

      suggestionsDropdown.appendChild(item);
    });
    suggestionsDropdown.style.display = 'block';
  }

  function hideSuggestions() {
    suggestionsDropdown.style.display = 'none';
    suggestionsDropdown.innerHTML = '';
  }

  // --- Weather & Analytics Dashboard Logic ---

  async function executeCitySelect(cityData) {
    showLoadingState();
    hideErrorBanner();

    currentCityData = cityData;

    try {
      const weather = await window.APIService.fetchWeather(cityData.lat, cityData.lon);
      currentWeatherState = weather;

      populateDashboard();
      showDashboardState();

      // Load or update map
      setTimeout(() => {
        initializeOrUpdateMap(cityData.lat, cityData.lon, cityData.city);
      }, 100);

    } catch (err) {
      console.error("Failed to load meteorological outputs:", err);
      showErrorBanner("Could not fetch meteorological indicators for this location. Displaying last cached metrics or local estimates.");
      loadFallbackWeatherState(cityData);
    }
  }

  function loadFallbackWeatherState(cityData) {
    // Generate a fallback weather based on general warm parameters for a fallback UI experience
    currentWeatherState = {
      temperature: 32.5,
      apparentTemperature: 35.8,
      humidity: 65,
      windSpeed: 12.0,
      weatherCode: 3,
      condition: { label: "Sunny (Estimated)", icon: "sun" }
    };

    populateDashboard();
    showDashboardState();

    setTimeout(() => {
      initializeOrUpdateMap(cityData.lat, cityData.lon, cityData.city);
    }, 100);
  }

  function populateDashboard() {
    if (!currentCityData || !currentWeatherState) return;

    // Set titles
    cityTitleDisplay.textContent = `${currentCityData.city}, ${currentCityData.state || 'India'}`;

    const now = new Date();
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', dateOptions);

    // Weather specs
    tempMainDisplay.textContent = `${currentWeatherState.temperature.toFixed(1)}°C`;
    tempFeelsDisplay.textContent = `Feels like ${currentWeatherState.apparentTemperature.toFixed(1)}°C`;
    humidityDisplay.textContent = `${currentWeatherState.humidity}%`;
    windDisplay.textContent = `${currentWeatherState.windSpeed.toFixed(1)} km/h`;

    // Render Lucide weather icon
    weatherIconBox.innerHTML = `<i data-lucide="${currentWeatherState.condition.icon}" style="width: 36px; height: 36px;"></i>`;

    // Compute Heat Score
    const heatScore = calculateHeatScore(
      currentWeatherState.apparentTemperature,
      currentWeatherState.humidity,
      currentWeatherState.windSpeed
    );

    // Render Heat index card variables
    const heatModel = window.CONFIG.HEAT_LEVELS[heatScore];
    heatScoreDisplay.textContent = heatScore;
    heatLevelLabel.textContent = `${heatModel.label} (Level ${heatScore})`;

    // Clear old color theme class and append new one
    heatBadgeContainer.className = 'heat-score-badge';
    heatBadgeContainer.classList.add(heatModel.class);

    // Recalculate plantation outputs based on slider value
    updateTreeRecommendations();

    lucide.createIcons();
  }

  /**
   * Computes the 1-10 Heat Scale based on configured parameters
   */
  function calculateHeatScore(apparentTemp, humidity, windSpeed) {
    const weights = window.CONFIG.HEAT_SCORING;

    // Raw index calculation
    const rawVal = (apparentTemp * weights.TEMP_WEIGHT) +
      (humidity * weights.HUMIDITY_WEIGHT) +
      (windSpeed * weights.WIND_WEIGHT);

    // Normalize value linearly to a range of 1 - 10
    const rawMin = weights.MIN_RAW_METRIC;
    const rawMax = weights.MAX_RAW_METRIC;

    let normalized = Math.round(((rawVal - rawMin) / (rawMax - rawMin)) * 9) + 1;

    // Force score boundaries
    normalized = Math.max(1, Math.min(10, normalized));
    return normalized;
  }

  function handleSliderChange(e) {
    const val = parseFloat(e.target.value).toFixed(1);
    sliderTargetVal.textContent = `-${val}°C`;
    updateTreeRecommendations();
  }

  /**
   * Recalculates necessary tree numbers and expected metrics based on slider cooling target
   */
  function updateTreeRecommendations() {
    if (!currentWeatherState) return;

    const targetCooling = parseFloat(coolingSlider.value);
    const plantationConfig = window.CONFIG.PLANTATION;

    // Trees count required
    const tempDelta = Math.max(
      targetCooling,
      currentWeatherState.temperature - 20
    );
    let treeCount = Math.round(tempDelta / plantationConfig.COOLING_EFFECT_PER_TREE);

    // Constrain by minimum base canopy cover rules
    if (treeCount < plantationConfig.MINIMUM_TREES_BASE) {
      treeCount = plantationConfig.MINIMUM_TREES_BASE;
    }

    // Expected score improvements
    const currentScore = calculateHeatScore(
      currentWeatherState.apparentTemperature,
      currentWeatherState.humidity,
      currentWeatherState.windSpeed
    );

    const projectedApparentTemp = currentWeatherState.apparentTemperature - targetCooling;
    const projectedScore = calculateHeatScore(
      projectedApparentTemp,
      currentWeatherState.humidity,
      currentWeatherState.windSpeed
    );

    // Populate widgets
    metricTreesCount.textContent = treeCount.toLocaleString();
    metricHeatDrop.textContent = `${currentScore} → ${projectedScore}`;

    // Render detailed zones distribution UI
    renderZonalDistribution(treeCount);
  }

  function renderZonalDistribution(totalTrees) {
    zonesBreakdownList.innerHTML = '';
    const zones = window.CONFIG.PLANTATION.ZONES;

    zones.forEach(zone => {
      const zoneTrees = Math.round(totalTrees * zone.share);
      const item = document.createElement('div');
      item.className = 'zone-item';

      // Pick matching lucide icon
      let zoneIconName = 'map-pin';
      if (zone.name.includes('Roadside')) zoneIconName = 'route';
      else if (zone.name.includes('Parks')) zoneIconName = 'trees';
      else if (zone.name.includes('Parking')) zoneIconName = 'square-parking';
      else if (zone.name.includes('School')) zoneIconName = 'graduation-cap';

      item.innerHTML = `
        <div class="zone-details">
          <div class="zone-icon">
            <i data-lucide="${zoneIconName}" style="width: 18px; height: 18px;"></i>
          </div>
          <div class="zone-meta">
            <span class="zone-title">${zone.name}</span>
            <span class="zone-desc">${zone.description}</span>
          </div>
        </div>
        <div class="zone-quantity">
          <span class="zone-tree-count">${zoneTrees.toLocaleString()}</span>
          <span class="zone-percentage">${Math.round(zone.share * 100)}% allocation</span>
        </div>
      `;
      zonesBreakdownList.appendChild(item);
    });

    lucide.createIcons();
  }

  // --- Accordion Logic ---

  function toggleAccordion() {
    const isActive = accordionBody.classList.contains('active');
    if (isActive) {
      accordionBody.classList.remove('active');
      accordionArrow.style.transform = 'rotate(0deg)';
    } else {
      accordionBody.classList.add('active');
      accordionArrow.style.transform = 'rotate(180deg)';
    }
  }

  // --- Leaflet Mapping Coordinates Integration ---

  function initializeOrUpdateMap(lat, lon, cityName) {
    const mapContainer = document.getElementById('leaflet-map');
    if (!mapContainer) return;

    // Check if instance already running
    if (!leafletMapInstance) {
      leafletMapInstance = L.map('leaflet-map', {
        zoomControl: false,
        attributionControl: false
      }).setView([lat, lon], 12);

      // Dark style theme layers
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(leafletMapInstance);

      // Add simple zoom controls at bottom-right
      L.control.zoom({
        position: 'bottomright'
      }).addTo(leafletMapInstance);

      mapMarkersLayerGroup = L.layerGroup().addTo(leafletMapInstance);
    } else {
      leafletMapInstance.setView([lat, lon], 12);
      mapMarkersLayerGroup.clearLayers();
    }

    // Fix grey map issue when drawing leaflet map in previously hidden container
    leafletMapInstance.invalidateSize();

    // Place a central visual indicator of the query center
    const heatColor = getHeatHexColor(
      currentWeatherState.apparentTemperature,
      currentWeatherState.humidity,
      currentWeatherState.windSpeed
    );

    // City center marker / boundary circle representing heat radius
    L.circle([lat, lon], {
      color: heatColor,
      fillColor: heatColor,
      fillOpacity: 0.15,
      radius: 3500 // 3.5 km boundary representing heat zone footprint
    }).addTo(mapMarkersLayerGroup)
      .bindPopup(`<strong>${cityName} Heat Zone Boundary</strong><br>Ambient Temp: ${currentWeatherState.temperature}°C`);

    // Place a few mock green markers within the visual radius representing suggested zone locations
    const zones = window.CONFIG.PLANTATION.ZONES;
    zones.forEach((zone, index) => {
      // Create slight offsets of coordinates from the center
      const latOffset = (Math.random() - 0.5) * 0.03;
      const lonOffset = (Math.random() - 0.5) * 0.03;
      const zoneLat = lat + latOffset;
      const zoneLon = lon + lonOffset;

      const zoneTrees = Math.round(parseInt(metricTreesCount.textContent.replace(/,/g, '')) * zone.share);

      // Create a green Leaflet pin marker
      const greenIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: var(--color-emerald); width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(16,185,129,0.8);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      L.marker([zoneLat, zoneLon], { icon: greenIcon })
        .addTo(mapMarkersLayerGroup)
        .bindPopup(`
          <div style="font-family: var(--font-body); font-size: 12px; color: #111;">
            <strong style="color: var(--color-emerald); font-size: 13px;">${zone.name}</strong><br>
            <em>Recommended plantation zone</em><br><br>
            <strong>Target trees:</strong> ${zoneTrees.toLocaleString()}<br>
            <strong>Mitigation focus:</strong> ${zone.description}
          </div>
        `);
    });
  }

  function getHeatHexColor(apparentTemp, humidity, windSpeed) {
    const score = calculateHeatScore(apparentTemp, humidity, windSpeed);
    if (score <= 2) return '#06B6D4'; // Cool Blue
    if (score <= 4) return '#10B981'; // Green
    if (score <= 6) return '#F59E0B'; // Amber
    if (score <= 8) return '#F97316'; // Orange
    return '#EF4444'; // Red
  }
});
