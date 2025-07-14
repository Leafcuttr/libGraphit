# @grafana-renderer/svelte

Svelte adapter for the Grafana Chart.js Renderer.

## Installation

```bash
npm install @grafana-renderer/svelte @grafana-renderer/core chart.js chartjs-plugin-datasource-prometheus chartjs-adapter-date-fns date-fns
```

## Usage

### Component Usage

```svelte
<script>
  import { GrafanaPanel } from '@grafana-renderer/svelte';
  import panelData from './my-panel.json';
</script>

<GrafanaPanel
  panelJson={panelData}
  prometheusUrl="http://localhost:9090"
  theme="light"
  width="100%"
  height="400px"
/>
```

### Action Usage

```svelte
<script>
  import { grafanaAction } from '@grafana-renderer/svelte';
  
  const params = {
    panelJson: { /* panel JSON */ },
    options: {
      prometheusUrl: 'http://localhost:9090',
      theme: 'light'
    }
  };
</script>

<canvas use:grafanaAction={params}></canvas>
```

## Component Props

### GrafanaPanel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `panelJson` | `GrafanaPanel` | required | The Grafana panel JSON configuration |
| `prometheusUrl` | `string` | required | URL of the Prometheus server |
| `timeRange` | `{from: string, to: string}` | `undefined` | Time range for queries |
| `theme` | `'light' \| 'dark'` | `'light'` | Chart theme |
| `refreshInterval` | `number` | `undefined` | Auto-refresh interval in milliseconds |
| `width` | `string` | `'100%'` | Chart container width |
| `height` | `string` | `'400px'` | Chart container height |
| `class` | `string` | `''` | Additional CSS classes |

## CSS Custom Properties

The component supports CSS custom properties for theming:

```css
.my-chart {
  --bg-color: #ffffff;
  --border-color: #e0e0e0;
  --text-color: #333333;
  --text-muted: #6c757d;
  --accent-color: #007bff;
  --error-color: #dc3545;
}
```

## License

MIT