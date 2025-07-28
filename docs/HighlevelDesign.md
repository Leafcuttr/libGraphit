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
|  +--------------------------------------------------+ |
|  |              GrafanaRenderer                     | |
|  |  - parsePanel() (private)                        | |
|  |  - mapToChartConfig() (private)                  | |
|  |  - applyTheme() (private)                        | |
|  |  - render() (public)                             | |
|  +--------------------------------------------------+ |
+------------------------------------------------------+
|        Third-Party Libraries (Chart.js, etc.)        |
+------------------------------------------------------+
```

3.1. Core Rendering Engine (Framework-Agnostic)

This is the heart of the library, published as a standalone package. It will have no knowledge of any specific UI framework.

*    GrafanaRenderer: A consolidated class that handles all rendering functionality. It accepts an HTML <canvas> element and Grafana panel JSON through its constructor and render method. The class internally handles:
     - JSON parsing and validation (private parsePanel method)
     - Chart.js configuration mapping (private mapToChartConfig method) 
     - Theme application (private applyTheme method)
     - Chart.js instance lifecycle management (creation, updates, destruction)
     - Direct transformation from GrafanaPanel to PrometheusChartConfig without intermediate representations

3.2. Framework Adapters

These are thin, separate packages that make the core engine easy to use within a specific UI framework.

*    SvelteKit Adapter (Initial Target): This will likely be implemented as a Svelte Action (use:grafanaDashboard) or a component (<GrafanaPanel>). It will handle creating the <canvas> element, passing it to the core engine, and cleaning up the chart instance when the component is destroyed.

4. Data Flow

*    Initialization: The user's application (e.g., a SvelteKit page) imports the SvelteKit adapter.

*    Component Mount: The Svelte component mounts. It receives the Grafana JSON as a prop.

*    Invocation: The adapter creates a <canvas> element, instantiates a GrafanaRenderer with the canvas and options, then calls the render method with the panel JSON.

*    Processing: The GrafanaRenderer internally handles the complete transformation pipeline:
     - Parses the Grafana panel JSON, extracting panel definitions (title, PromQL query, panel type)
     - Maps the panel data directly to a Chart.js configuration object
     - Places the PromQL query in options.plugins.datasource-prometheus.query
     - Maps Grafana panel types (graph, timeseries) to Chart.js types (line)
     - Maps title, axes, and visual settings to their Chart.js equivalents
     - Applies theme configuration (light/dark mode)

*    Rendering: The GrafanaRenderer creates a new Chart.js instance using the generated configuration and returns a result object with lifecycle methods.

*    Data Fetching: The chartjs-plugin-datasource-prometheus automatically handles fetching the data from the Prometheus endpoint specified in the configuration and populates the chart.

5. API Design (Conceptual)

Core Engine API

```
interface GrafanaRendererOptions {
  prometheusUrl?: string;
  queryHandler?: QueryHandler;
  timeRange?: {
    start: number;
    end: number;
    step?: number;
  };
  theme?: 'light' | 'dark';
  refreshInterval?: number;
}

interface RendererResult {
  chart: Chart;
  destroy: () => void;
  update: (options?: Partial<GrafanaRendererOptions>) => void;
}

// Main class-based API
class GrafanaRenderer {
  constructor(canvas: HTMLCanvasElement, options: GrafanaRendererOptions);
  
  async render(panelJson: GrafanaPanel): Promise<RendererResult>;
  update(newOptions?: Partial<GrafanaRendererOptions>): void;
  destroy(): void;
}
```

### SvelteKit Adapter API

```svelte
<!-- As a component -->
<script>
  import { GrafanaPanel } from '@grafana-renderer/svelte';
  import dashboard from './my-dashboard.json';

  const panel = dashboard.panels[0];
  const options = {
    prometheusUrl: 'http://localhost:9090',
    theme: 'light'
  };
</script>

<div class="chart-container">
  <GrafanaPanel panelJson={panel} {options} />
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
