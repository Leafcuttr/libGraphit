# @leafcuttr/libgraphit-core

The core framework-agnostic library for rendering Grafana panels with Chart.js.

## Installation

```bash
npm install @leafcuttr/libgraphit-core chart.js chartjs-plugin-datasource-prometheus chartjs-adapter-date-fns date-fns
```

## Usage

```typescript
import { GrafanaRenderer } from '@leafcuttr/libgraphit-core';

// Get the canvas element
const canvas = document.getElementById('chart') as HTMLCanvasElement;

// Your Grafana panel JSON
const panelJson = { /* ... your panel JSON ... */ };

// Renderer options
const options = {
  prometheusUrl: 'http://localhost:9090', // Your Prometheus instance
};

// Create a new renderer instance
const renderer = new GrafanaRenderer(canvas, options);

// Render the panel
renderer.render(panelJson).then(result => {
  console.log('Chart rendered successfully!', result.chart);

  // You can now interact with the chart instance
  // result.update({ theme: 'dark' });
  // result.destroy();
});
```

## API Reference

### `GrafanaRenderer`

The main class for rendering Grafana panels.

**`constructor(canvas: HTMLCanvasElement, options: GrafanaRendererOptions)`**

Creates a new `GrafanaRenderer` instance.

-   `canvas`: The HTML canvas element to render the chart on.
-   `options`: Configuration options for the renderer. See `GrafanaRendererOptions`.

**`render(panelJson: GrafanaPanel): Promise<RendererResult>`**

Renders a Grafana panel.

-   `panelJson`: The JSON object representing a single Grafana panel.
-   Returns a `Promise` that resolves with a `RendererResult` object.

**`update(options?: Partial<GrafanaRendererOptions>): void`**

Updates the chart with new options.

-   `options`: The new options to apply.

**`destroy(): void`**

Destroys the chart instance and cleans up resources.

---

### Important Types

**`GrafanaRendererOptions`**

An object containing configuration for the renderer.

-   `prometheusUrl?: string`: The URL of your Prometheus server.
-   `queryHandler?: QueryHandler`: A custom function to handle data fetching. This allows you to implement custom logic for retrieving and transforming data.
-   `timeRange?: { start: number; end: number; step?: number; }`: The time range for the queries.
-   `theme?: 'light' | 'dark'`: The theme for the chart. Defaults to `'light'`.
-   `refreshInterval?: number`: The interval in milliseconds to refresh the chart.

**`QueryHandler`**

A function signature for custom query handling.
`type QueryHandler = (query: string, start: Date, end: Date, step: number) => Promise<any>;`

**`RendererResult`**

An object returned by the `render` method.

-   `chart: Chart`: The Chart.js chart instance.
-   `destroy: () => void`: A function to destroy the chart.
-   `update: (options?: Partial<GrafanaRendererOptions>) => void`: A function to update the chart with new options.

**`GrafanaDashboard`**

The library also understands the structure of a Grafana dashboard JSON, which contains an array of `GrafanaPanel` objects. You can iterate over the `panels` array in a dashboard and render each one individually.

## Supported Panel Types

-   `timeseries` - Time series line charts
-   `stat` - Single stat panels
-   `graph` - Legacy graph panels (mapped to line charts)
-   `gauge` - Gauge panels (mapped to doughnut charts)
-   `table` - Table panels (basic support)

## License

MIT