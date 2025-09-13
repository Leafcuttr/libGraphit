# @leafcuttr/libgraphit-core

The core framework-agnostic library for rendering Grafana panels with Chart.js.

## Installation

```bash
npm install @leafcuttr/libgraphit-core chart.js chartjs-plugin-datasource-prometheus chartjs-adapter-date-fns date-fns
```

## Usage

```typescript
import { GrafanaRenderer } from '@leafcuttr/libgraphit-core';

const canvas = document.getElementById('chart') as HTMLCanvasElement;
const panelJson = { /* your Grafana panel JSON */ };
const options = {
  prometheusUrl: 'http://localhost:9090',
  theme: 'light'
};

const result = await GrafanaRenderer.renderPanel(canvas, panelJson, options);
```

## API Reference

### GrafanaRenderer

Main class for rendering Grafana panels.

#### Methods

- `constructor(canvas: HTMLCanvasElement, options: GrafanaRendererOptions)`
- `render(panelJson: GrafanaPanel): Promise<RendererResult>`
- `update(options?: Partial<GrafanaRendererOptions>): void`
- `destroy(): void`
- `static renderPanel(canvas, panelJson, options): Promise<RendererResult>`

### GrafanaJsonParser

Utility class for parsing Grafana panel JSON.

#### Methods

- `static parsePanel(panelJson: GrafanaPanel): ParsedPanel`
- `static validatePanel(panelJson: any): boolean`

### ChartConfigMapper

Utility class for mapping parsed panels to Chart.js configurations.

#### Methods

- `static mapToChartConfig(panel: ParsedPanel, options: GrafanaRendererOptions): PrometheusChartConfig`
- `static applyTheme(config: PrometheusChartConfig, theme: 'light' | 'dark'): PrometheusChartConfig`

## Supported Panel Types

- `timeseries` - Time series line charts
- `stat` - Single stat panels
- `graph` - Legacy graph panels (mapped to line charts)
- `gauge` - Gauge panels (mapped to doughnut charts)
- `table` - Table panels (basic support)

## License

MIT