// Configuration constants for the Vriksha Index
const CONFIG = {
  // Weights and formula constants for heat score calculation
  // Score = (ApparentTemp * TEMP_WEIGHT) + (Humidity * HUMIDITY_WEIGHT) + (WindSpeed * WIND_WEIGHT)
  HEAT_SCORING: {
    TEMP_WEIGHT: 0.7,
    HUMIDITY_WEIGHT: 0.1,
    WIND_WEIGHT: -0.15, // Wind helps reduce heat

    // Bounds for normalization to a 1-10 scale
    MIN_RAW_METRIC: 10,  // e.g., equivalent to ~15°C with moderate wind/humidity
    MAX_RAW_METRIC: 40,  // e.g., equivalent to ~48°C with high humidity
  },

  // Color mapping and descriptive ranges for the 1-10 Heat Score
  HEAT_LEVELS: {
    1: { label: "Very Cool", class: "heat-very-cool", desc: "Comfortable and pleasant weather conditions." },
    2: { label: "Very Cool", class: "heat-very-cool", desc: "Comfortable and pleasant weather conditions." },
    3: { label: "Mild", class: "heat-mild", desc: "Mild conditions. Ideal for outdoor activities." },
    4: { label: "Mild", class: "heat-mild", desc: "Mild conditions. Ideal for outdoor activities." },
    5: { label: "Warm", class: "heat-warm", desc: "Warm and slightly humid. Keep hydrated." },
    6: { label: "Warm", class: "heat-warm", desc: "Warm and slightly humid. Keep hydrated." },
    7: { label: "Hot", class: "heat-hot", desc: "Hot conditions. Limit outdoor activities during peak sun." },
    8: { label: "Hot", class: "heat-hot", desc: "Hot conditions. Limit outdoor activities during peak sun." },
    9: { label: "Extreme Heat", class: "heat-extreme", desc: "Dangerously high temperatures. Stay indoors with cooling." },
    10: { label: "Extreme Heat", class: "heat-extreme", desc: "Extreme thermal distress. Critical cooling interventions needed." }
  },

  // Tree plantation recommendation logic
  PLANTATION: {
    // Expected cooling in degrees Celsius per mature tree in its local microclimate area
    COOLING_EFFECT_PER_TREE: 0.0005,

    // Base minimum trees even if the delta is very low, to maintain healthy cover
    MINIMUM_TREES_BASE: 150,

    // Expected canopy cooling efficiency coefficients per zone type
    // These define how much impact trees in specific zones have relative to base
    ZONES: [
      { name: "Roadsides & Green Corridors", share: 0.30, efficiencyMultiplier: 1.2, description: "Combats vehicle heat and creates shaded pathways." },
      { name: "Public Parks & Open Spaces", share: 0.35, efficiencyMultiplier: 1.0, description: "Improves overall community canopy and soil moisture." },
      { name: "Parking Lots & High-Albedo Zones", share: 0.15, efficiencyMultiplier: 1.4, description: "Reduces critical urban heat island effects from tarmac." },
      { name: "Institutional & School Grounds", share: 0.20, efficiencyMultiplier: 1.1, description: "Protects community gathering areas and children." }
    ]
  },

  // Default quick-search cities in India
  POPULAR_CITIES: [
    { name: "New Delhi", state: "Delhi", lat: 28.6139, lon: 77.2090 },
    { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lon: 72.8777 },
    { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946 },
    { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707 },
    { name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639 }
  ]
};

// Export to window object for global visibility in modular ES/vanilla setups
window.CONFIG = CONFIG;
