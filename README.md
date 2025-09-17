# libGraphit

## Grafana Chart.js Renderer

A lightweight, embeddable, and framework-agnostic library to render Grafana panels in your own web applications using the power of Chart.js.
## The Problem

You have invested time creating powerful and beautiful dashboards in Grafana, but you want to embed those visualizations directly into your custom web applications without using iframes. You want full control over the user experience while reusing the visualization logic (queries, titles, units) already defined in your Grafana JSON.
## The Solution

This library parses your Grafana dashboard JSON, extracts the configuration for individual panels, and renders them as interactive Chart.js charts. It uses the chartjs-plugin-datasource-prometheus to handle live data fetching directly from your Prometheus instance.

This means you can define your charts in Grafana and render them anywhere!
## Features

   * **Render Entire Dashboards**: Use the `<GrafanaDashboard>` Svelte or React component to render a full dashboard grid.
   * **Framework-Agnostic Core**: Use the core rendering engine in any JavaScript project.
   * **Svelte and React Adapters**: Get up and running in SvelteKit or React in minutes with the `<GrafanaPanel>` component.
   * **Type-Safe**: Written entirely in TypeScript.
   * **Dynamic Data**: Charts are connected directly to your Prometheus datasource.
   * **Reusable Logic**: Don't repeat your PromQL queries and chart configurations.

## Installation

First, you need the core library and the adapter for your framework of choice. Svelte and React are officially supported.

You will also need to install Chart.js and its Prometheus plugin, which are peer dependencies.

```
npm install chart.js chartjs-adapter-date-fns date-fns chartjs-plugin-datasource-prometheus
```

Then, install the core library and the adapter for your framework:

**Svelte**
```
npm install @leafcuttr/libgraphit-core @leafcuttr/libgraphit-svelte
```

**React**
```
npm install @leafcuttr/libgraphit-core @leafcuttr/libgraphit-react
```

## Usage with React

There are two primary ways to use the React adapter: rendering a full dashboard or rendering a single panel.

### Rendering a Full Dashboard

The easiest way to get started is to render an entire dashboard. The `GrafanaDashboard` component will handle the layout and render all panels.

  *  **Get your Grafana Dashboard JSON**:
     - In Grafana, go to your dashboard settings (the cog icon).
     - Select "JSON Model" from the side menu.
     - Copy the entire JSON object and save it as a `.json` file in your project.

  *  **Use the component in your `.tsx` file**:

```tsx
import { GrafanaDashboard } from '@leafcuttr/libgraphit-react';
import type { GrafanaDashboard as GrafanaDashboardType } from '@leafcuttr/libgraphit-core';
import dashboardJson from './your-dashboard.json';
import './App.css';

const PROMETHEUS_URL = 'http://localhost:9090';

function App() {
  return (
    <div>
      <h1>My Application Dashboard</h1>
      <p>This entire dashboard is defined in Grafana but rendered here with React and Chart.js!</p>
      <GrafanaDashboard
        dashboardJson={dashboardJson as GrafanaDashboardType}
        prometheusUrl={PROMETHEUS_URL}
        theme="dark"
      />
    </div>
  );
}

export default App;
```

### Rendering a Single Panel

If you only need a single panel from a dashboard, you can use the `GrafanaPanel` component.

  *  **Get your Panel JSON**: Follow the steps above to get the dashboard JSON, then find the specific panel you want in the `panels` array and extract its JSON object.

  *  **Use the component in your `.tsx` file**:

```tsx
import { GrafanaPanel } from '@leafcuttr/libgraphit-react';
import type { Panel } from '@leafcuttr/libgraphit-core';
import dashboardJson from './your-dashboard.json';
import './App.css';

const PROMETHEUS_URL = 'http://localhost:9090';
const panelJson = dashboardJson.panels.find(p => p.title === 'My Awesome Panel') as Panel | undefined;

function App() {
  return (
    <div style={{ width: '80%', height: '400px', margin: 'auto' }}>
      {panelJson ? (
        <GrafanaPanel
          panelJson={panelJson}
          prometheusUrl={PROMETHEUS_URL}
        />
      ) : (
        <p>Panel configuration not found.</p>
      )}
    </div>
  );
}
```

## Usage with SvelteKit

There are two primary ways to use the Svelte adapter: rendering a full dashboard or rendering a single panel.

### Rendering a Full Dashboard

The easiest way to get started is to render an entire dashboard. The `<GrafanaDashboard>` component will handle the layout and render all panels.

  *  **Get your Grafana Dashboard JSON**:
     - In Grafana, go to your dashboard settings (the cog icon).
     - Select "JSON Model" from the side menu.
     - Copy the entire JSON object and save it as a `.json` file in your project.

  *  **Use the component in your `.svelte` file**:

```svelte
<script lang="ts">
  import { GrafanaDashboard } from '@leafcuttr/libgraphit-svelte';
  import dashboardJson from '$lib/your-dashboard.json';

  const PROMETHEUS_URL = 'http://localhost:9090';
</script>

<main>
  <h1>My Application Dashboard</h1>
  <p>This entire dashboard is defined in Grafana but rendered here with Svelte and Chart.js!</p>

  <GrafanaDashboard
    dashboardJson={dashboardJson}
    prometheusUrl={PROMETHEUS_URL}
    theme="dark"
  />
</main>
```

### Rendering a Single Panel

If you only need a single panel from a dashboard, you can use the `<GrafanaPanel>` component.

  *  **Get your Panel JSON**: Follow the steps above to get the dashboard JSON, then find the specific panel you want in the `panels` array and extract its JSON object.

  *  **Use the component in your `.svelte` file**:

```svelte
<script lang="ts">
  import { GrafanaPanel } from '@leafcuttr/libgraphit-svelte';
  import dashboardJson from '$lib/your-dashboard.json';

  const PROMETHEUS_URL = 'http://localhost:9090';
  const panelJson = dashboardJson.panels.find(p => p.title === 'My Awesome Panel');
</script>

<main>
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
* @leafcuttr/libgraphit-core: A vanilla TypeScript engine that takes a Grafana panel JSON object and an HTMLCanvasElement and returns a Chart.js instance. It contains all the parsing and mapping logic.

* @leafcuttr/libgraphit-svelte: A thin wrapper that provides Svelte components (`<GrafanaDashboard>` and `<GrafanaPanel>`) to make integration with Svelte's lifecycle seamless.

* @leafcuttr/libgraphit-react: A thin wrapper that provides React components (`<GrafanaDashboard>` and `<GrafanaPanel>`) to make integration with React's lifecycle seamless.

This architecture allows for new adapters (e.g., for Vue) to be built on top of the same core engine.
Current Limitations

  * **Panel Support**: Currently, `timeseries`, `graph`, `stat`, `gauge`, and `table` panels are supported. Community contributions for other panel types are welcome.

  * Datasource: Only Prometheus is supported as a datasource.

  * Template Variables: Grafana's template variables are not yet supported.

## Contributing

Contributions are welcome! Please feel free to open an issue to discuss a new feature or submit a pull request.
