# 🌳 Vriksha Index: AI Urban Green Planner

> **Track Heat Scores. Plan Reforestation. Powered by AI.**

Vriksha Index is an agentic, data-driven web application designed to help cities combat the Urban Heat Island (UHI) effect. By leveraging real-time meteorological data and the **Lemma Agent SDK**, Vriksha Index dynamically models urban thermal mitigation and generates highly localized, actionable tree canopy interventions.

---

## 🚨 The Problem

**Urban heat is a growing crisis.** 
As cities expand, concrete and asphalt replace natural landscapes, absorbing and radiating heat to create localized "Heat Islands." This phenomenon drastically increases urban temperatures, leading to:
- **Public Health Risks:** Heatstroke, respiratory distress, and increased mortality rates during summer peaks.
- **Energy Drain:** Skyrocketing reliance on air conditioning systems, which further contributes to greenhouse gas emissions.
- **Biodiversity Loss:** Severe decline in local flora and fauna.

Currently, urban planners lack accessible, dynamic tools to precisely determine **where** to plant, **what** to plant, and **how many** trees are required to achieve specific cooling targets.

---

## 💡 The Solution

Vriksha Index bridges the gap between raw climate data and actionable urban planning. Our platform allows users to:
1. Search any city to instantly view a calculated 1-10 **Heat Risk Score** derived from real-time temperature, humidity, and wind speeds.
2. Dynamically set a **Cooling Target** (e.g., reduce apparent temperature by 3°C).
3. Use an autonomous **Lemma AI Agent** to automatically generate a tailored plantation strategy, including precise tree counts, recommended native species, and zonal allocation.

---

## 🚀 User Workflow

1. **Search & Locate:** The user searches for a target city or district using the integrated location autocomplete.
2. **Analyze Data:** The dashboard fetches real-time meteorological feeds, calculating the local heat index and rendering a thermal radius map.
3. **Configure Targets:** The user adjusts a desired cooling slider to calculate the exact quota of trees needed to achieve that temperature drop.
4. **Generate AI Plan:** The user clicks "Generate AI Green Plan". The app passes the environmental context to the **Lemma Agent**, which processes the data and outputs a comprehensive, species-specific urban forestry strategy and calculates real-world environmental impact metrics.

---

## 🧠 Lemma SDK Integration Architecture

Vriksha Index acts as an agentic workflow layer powered by the **Lemma SDK**:
- **Context Injection:** When a plan is requested, the client-side app packages the city name, active heat score, targeted tree count, and raw meteorological data into an `agentContext` payload.
- **Service Layer:** `lemmaAgent.js` acts as the integration gateway. It interfaces with the Lemma SDK, prompting the LLM with system instructions tailored for an "AI Urban Green Planner."
- **Dynamic Reasoning:** The agent autonomously analyzes the environmental constraints (e.g., extreme heat vs. moderate heat) and selects the most optimal native tree species (e.g., Neem for high heat, Gulmohar for biodiversity).
- **Structured Output:** The SDK returns a structured response containing the HTML-formatted species list, the AI's logical reasoning, and a calculated impact forecast, which is then seamlessly injected back into the UI.

---

## ✨ Features

- **Real-Time Heat Scoring (1-10):** A custom algorithm blending apparent temperature, humidity, and wind mitigation.
- **Dynamic Canopy Planner:** Slider-based configuration to estimate the minimum trees needed for a target temperature drop.
- **Smart Zonal Placements:** Distributes plantation quotas across high-impact regions (roadsides, parks, parking lots).
- **Interactive Mapping:** Visualizes the urban heat radius and recommended plantation zones using Leaflet.js.
- **AI-Powered Recommendations:** Delivers context-aware species recommendations and environmental impact estimates (Temp Reduction, CO₂ Absorption, Green Coverage, Water Retention).

---

## 🛠 Tech Stack

- **Frontend:** HTML5, Vanilla JavaScript, CSS3 (Glassmorphism design system)
- **AI & Workflow Infrastructure:** Lemma SDK (`lemmaAgent.js`)
- **Mapping:** Leaflet.js, OpenStreetMap
- **Icons:** Lucide Icons
- **APIs:** Open-Meteo (Weather Feeds), Nominatim (Geocoding)

---

## 💻 How to Run Locally

Vriksha Index is a lightweight, client-side application that requires zero complex build steps.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/vriksha-index.git
   cd vriksha-index
   ```

2. **Configure Lemma SDK (Hackathon Step):**
   - Open `lemmaAgent.js`.
   - Locate the `HACKATHON TODO` section in the constructor.
   - Initialize your Lemma Client and inject your API keys.

3. **Serve the App:**
   - **Using Live Server:** Open the project in VS Code and click "Go Live" with the Live Server extension.
   - **Using Node (npx):** Run `npx serve .` in your terminal and open the provided `localhost` link.

---

## 🔮 Future Improvements

- **Satellite Imagery Integration:** Use NDVI (Normalized Difference Vegetation Index) API data to identify exact barren plots of land within the city.
- **Community Crowdfunding:** Add a module for citizens to "adopt a zone" and fund the recommended tree count.
- **Water Management Agent:** Implement a secondary AI agent to analyze local rainfall data and generate optimal irrigation schedules for the newly planted trees.
