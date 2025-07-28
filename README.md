# libGraphit

## Grafana Chart.js Renderer

A lightweight, embeddable, and framework-agnostic library to render Grafana panels in your own web applications using the power of Chart.js.
## The Problem

You have invested time creating powerful and beautiful dashboards in Grafana, but you want to embed those visualizations directly into your custom web applications without using iframes. You want full control over the user experience while reusing the visualization logic (queries, titles, units) already defined in your Grafana JSON.
## The Solution

This library parses your Grafana dashboard JSON, extracts the configuration for individual panels, and renders them as interactive Chart.js charts. It uses the chartjs-plugin-datasource-prometheus to handle live data fetching directly from your Prometheus instance.

This means you can define your charts in Grafana and render them anywhere!
## Features

   * Framework-Agnostic Core: Use it in any JavaScript project.

   * SvelteKit Adapter: Get up and running in SvelteKit in minutes.

   * Type-Safe: Written entirely in TypeScript.

   * Dynamic Data: Charts are connected directly to your Prometheus datasource.

   * Reusable Logic: Don't repeat your PromQL queries and chart configurations.

## Installation

First, you need the core library and the adapter for your framework of choice. For now, only SvelteKit is officially supported.

You will also need to install Chart.js and its Prometheus plugin, which are peer dependencies.

```
npm install chart.js chartjs-adapter-date-fns date-fns chartjs-plugin-datasource-prometheus
npm install @grafana-renderer/core @grafana-renderer/svelte
```

## Usage with SvelteKit

Using the library in a SvelteKit project is simple. Just import the GrafanaPanel component and pass it your panel's JSON configuration.

  *  Get your Grafana JSON:

     -   In Grafana, go to your dashboard settings (the cog icon).

     -   Select "JSON Model" from the side menu.

     -   Find the panel you want to render in the panels array. Copy that panel's JSON object. You can save this as a .json file in your project.

  *  Use the component in your .svelte file:

```svelte
<script lang="ts">
  import { GrafanaPanel } from '@grafana-renderer/svelte';

  // Import the entire dashboard JSON
  import dashboardJson from '$lib/your-dashboard.json';

  // Define your Prometheus endpoint
  const PROMETHEUS_URL = 'http://localhost:9090';

  // Select the specific panel you want to render from the JSON
  // For this example, we'll render the first panel in the array.
  const panelJson = dashboardJson.panels[0];
</script>

<main>
  <h1>My Application Dashboard</h1>
  <p>This chart is defined in Grafana but rendered here with Chart.js!</p>

  <div style="width: 80%; height: 400px; margin: auto;">
    {#if panelJson}
      <GrafanaPanel
        panelJson={panelJson}
        prometheusUrl={PROMETHEUS_URL}
      />
    {:else}
      <p>Panel configuration not found.</p>
    {/if}
  </div>
</main>
```

How It Works

The library consists of two main parts:
* @grafana-renderer/core: A vanilla TypeScript engine that provides a `GrafanaChart` class. This class takes a Grafana panel JSON object and an HTMLCanvasElement and renders a Chart.js instance. It contains all the parsing, mapping, and rendering logic.

* @grafana-renderer/svelte: A thin wrapper that provides a Svelte component (<GrafanaPanel>) to make integration with Svelte's lifecycle seamless.

This architecture allows for new adapters (e.g., for React or Vue) to be built on top of the same core engine.
Current Limitations

  * Panel Support: Currently, only timeseries and graph panels are well-supported.

  * Datasource: Only Prometheus is supported as a datasource.

  * Template Variables: Grafana's template variables are not yet supported.

## Contributing

Contributions are welcome! Please feel free to open an issue to discuss a new feature or submit a pull request.
