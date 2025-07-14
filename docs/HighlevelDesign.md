High-Level Design: Grafana to Chart.js Renderer

1. Introduction

This document outlines the high-level design for a TypeScript library that parses a Grafana dashboard JSON file and renders its panels using Chart.js and the chartjs-plugin-datasource-prometheus plugin.

The primary goal is to create a framework-agnostic core engine with a pluggable architecture for UI framework integration. The initial release will target SvelteKit, with the design allowing for future expansion to frameworks like React, Vue, and Angular.

2. Goals & Objectives

*    Decoupling: Separate Grafana's dashboard definition from its rendering environment.

*    Embeddability: Allow developers to easily embed Grafana-defined visualizations into their own applications.

*    Extensibility: Design a core engine that can be extended with new panel types and UI framework adapters.

*    Type Safety: Leverage TypeScript for a robust and maintainable codebase.

*    Performance: Efficiently render multiple charts on a single page.

3. Architecture Overview

The system will be designed with a layered architecture to ensure separation of concerns and promote modularity.

```
+------------------------------------------------------+
|             Application (e.g., SvelteKit)            |
+------------------------------------------------------+
|                 Framework Adapter                    |
|                (e.g., Svelte Action/Component)       |
+------------------------------------------------------+
|                  Core Rendering Engine               |
|                                                      |
|  +---------------------+  +------------------------+ |
|  | Grafana JSON Parser |  | Chart.js Config Mapper | |
|  +---------------------+  +------------------------+ |
|  |                Renderer Orchestrator             | |
|  +--------------------------------------------------+ |
+------------------------------------------------------+
|        Third-Party Libraries (Chart.js, etc.)        |
+------------------------------------------------------+
```

3.1. Core Rendering Engine (Framework-Agnostic)

This is the heart of the library, published as a standalone package. It will have no knowledge of any specific UI framework.

*    Grafana JSON Parser: Responsible for consuming the raw Grafana dashboard JSON. It will validate the structure and extract a sanitized, intermediate representation of the panels, their queries, and visualization options.

*    Chart.js Config Mapper: This is the most critical component. It takes the parsed panel data and translates it into a valid Chart.js configuration object. It will map Grafana panel types to Chart.js chart types and configure the chartjs-plugin-datasource-prometheus with the appropriate PromQL query, endpoint, and time range.

&    Renderer Orchestrator: The public-facing API of the core engine. It will accept an HTML <canvas> element and the Grafana JSON. It will orchestrate the parsing and mapping process, instantiate the Chart.js chart on the provided canvas, and manage its lifecycle (creation, updates, destruction).

3.2. Framework Adapters

These are thin, separate packages that make the core engine easy to use within a specific UI framework.

*    SvelteKit Adapter (Initial Target): This will likely be implemented as a Svelte Action (use:grafanaDashboard) or a component (<GrafanaPanel>). It will handle creating the <canvas> element, passing it to the core engine, and cleaning up the chart instance when the component is destroyed.

4. Data Flow

*    Initialization: The user's application (e.g., a SvelteKit page) imports the SvelteKit adapter.

*    Component Mount: The Svelte component mounts. It receives the Grafana JSON as a prop.

*    Invocation: The adapter creates a <canvas> element and calls the render function from the Core Rendering Engine, passing the canvas and the JSON.

*    Parsing: The Core Engine's Grafana JSON Parser processes the JSON, extracting panel definitions (e.g., title, PromQL query, panel type).

*    Mapping: For each panel, the Chart.js Config Mapper generates a corresponding Chart.js configuration object.

     -   The PromQL query is placed in options.plugins.datasource-prometheus.query.

     -   The Grafana panel type (graph, timeseries) is mapped to a Chart.js type (line).

     -   Title, axes, and other visual settings are mapped to their Chart.js equivalents.

*    Rendering: The Renderer Orchestrator creates a new Chart instance for each panel, using the generated configuration.

*    Data Fetching: The chartjs-plugin-datasource-prometheus automatically handles fetching the data from the Prometheus endpoint specified in the configuration and populates the chart.

5. API Design (Conceptual)

Core Engine API

```
interface GrafanaRendererOptions {
  // Potentially for global settings like theme, time range overrides, etc.
}

// Main entry point
function renderDashboard(
  canvasElement: HTMLCanvasElement,
  grafanaPanelJson: object, // A single panel object from the dashboard JSON
  options?: GrafanaRendererOptions
): Chart; // Returns the Chart.js instance for further manipulation
```

### SvelteKit Adapter API

```svelte
<!-- As a component -->
<script>
  import { GrafanaPanel } from 'grafana-renderer-svelte';
  import dashboard from './my-dashboard.json';

  const panel = dashboard.panels[0];
</script>

<div class="chart-container">
  <GrafanaPanel panelJson={panel} />
</div>
```

6. Constraints & Assumptions (v1.0)

*    Single Datasource: The entire dashboard is assumed to use a single, globally defined Prometheus datasource. The URL for this will be passed during initialization.

*    Limited Panel Support: The initial version will focus on supporting the most common panel type: timeseries (or the older graph). Support for singlestat, gauge, table, etc., will be added in future versions.

*    Time Range: The library will initially use the time range defined within the dashboard JSON, with an option to override it globally. Dynamic time range selectors will be a future feature.

*    No Template Variables: Support for Grafana's template variables will not be included in the initial version.

7. Future Enhancements

*    Support for more panel types (Gauge, Stat, Table).

*    Support for Grafana template variables.

*    Adapters for React, Vue, and Angular.

*    Interactive features (e.g., legend toggling, cross-hair synchronization).

*    Support for multiple datasource types (e.g., Loki, InfluxDB) by abstracting the Chart.js datasource plugin.
