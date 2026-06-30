/**
 * Lemma SDK Integration Layer
 
 
 */

class LemmaAgent {
  constructor() {
    // Lemma SDK Initialization
  }

  /**
   * Generates a plantation strategy using the Lemma Agent
   * @param {Object} contextData - Weather and city details
   * @returns {Object} Strategy object containing species and reasoning
   */
  async generatePlantationStrategy(contextData) {
    // MOCK DELAY (to simulate network latency for the AI processing state)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // FALLBACK MOCK RESPONSE
    const heatScore = contextData.heatScore;
    const coolingTarget = contextData.coolingTarget || 3.0;
    const city = contextData.city || 'this region';
    let species, reasoning;

    if (coolingTarget >= 5.0) {
      species = `
        <ul style="list-style: none; padding-left: 0; margin-top: 8px;">
          <li style="margin-bottom: 4px;">🌿 <strong>Banyan</strong> - Massive shade coverage for rapid cooling</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Peepal</strong> - Excellent transpiration cooling</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Neem</strong> - Dense canopy and high heat tolerance</li>
        </ul>
      `;
      reasoning = `The aggressive cooling target of -${coolingTarget}°C for ${city} requires prioritizing massive canopy species like Banyan and Peepal to maximize shade and evaporative cooling across urban zones.`;
    } else if (heatScore >= 8) {
      species = `
        <ul style="list-style: none; padding-left: 0; margin-top: 8px;">
          <li style="margin-bottom: 4px;">🌿 <strong>Neem</strong> - Extreme heat tolerant</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Khejri</strong> - Drought resistant</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Siris</strong> - Wide canopy coverage</li>
        </ul>
      `;
      reasoning = `High heat and dry conditions in ${city} require robust, deep-rooted native species that provide expansive canopy cover and resist severe thermal distress.`;
    } else if (heatScore >= 5 || coolingTarget >= 3.0) {
      species = `
        <ul style="list-style: none; padding-left: 0; margin-top: 8px;">
          <li style="margin-bottom: 4px;">🌿 <strong>Amaltas</strong> - Urban friendly canopy</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Jamun</strong> - Low maintenance</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Gulmohar</strong> - Biodiversity support</li>
        </ul>
      `;
      reasoning = `Moderate thermal metrics and cooling targets for ${city} suggest a balanced approach focusing on urban-friendly shade trees that also rapidly support local biodiversity.`;
    } else {
      species = `
        <ul style="list-style: none; padding-left: 0; margin-top: 8px;">
          <li style="margin-bottom: 4px;">🌿 <strong>Arjun</strong> - Biodiversity support</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Ashoka</strong> - Roadside greenery</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Kachnar</strong> - Local plantation</li>
        </ul>
      `;
      reasoning = `Comfortable temperatures and lower cooling targets in ${city} allow for diverse ornamental and structural plantations primarily for aesthetic, localized shading, and ecosystem health.`;
    }

    return {
      speciesHtml: species,
      reasoning: reasoning,
      impact: [
        "Reduced localized heat zones",
        "Improved air quality index (AQI)",
        "Better urban greenery and biodiversity"
      ]
    };
  }
}

// Export a singleton instance globally
window.LemmaAgentService = new LemmaAgent();
