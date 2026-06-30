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
    const city = contextData.city || 'this region';
    let species, reasoning;

    if (heatScore >= 8) {
      species = `
        <ul style="list-style: none; padding-left: 0; margin-top: 8px;">
          <li style="margin-bottom: 4px;">🌿 <strong>Neem</strong> - Extreme heat tolerant</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Banyan</strong> - Maximum shade coverage</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Khejri</strong> - Drought resistant</li>
        </ul>
      `;
      reasoning = `High heat and dry conditions in ${city} require robust, deep-rooted native species that provide expansive canopy cover and resist severe thermal distress.`;
    } else if (heatScore >= 5) {
      species = `
        <ul style="list-style: none; padding-left: 0; margin-top: 8px;">
          <li style="margin-bottom: 4px;">🌿 <strong>Amaltas</strong> - Urban friendly canopy</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Jamun</strong> - Low maintenance</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Gulmohar</strong> - Biodiversity support</li>
        </ul>
      `;
      reasoning = `Moderate thermal metrics for ${city} suggest a balanced approach focusing on urban-friendly shade trees that also rapidly support local biodiversity.`;
    } else {
      species = `
        <ul style="list-style: none; padding-left: 0; margin-top: 8px;">
          <li style="margin-bottom: 4px;">🌿 <strong>Arjun</strong> - Biodiversity support</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Ashoka</strong> - Roadside greenery</li>
          <li style="margin-bottom: 4px;">🌿 <strong>Kachnar</strong> - Local plantation</li>
        </ul>
      `;
      reasoning = `Comfortable temperatures in ${city} allow for diverse ornamental and structural plantations primarily for aesthetic, localized shading, and ecosystem health.`;
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
