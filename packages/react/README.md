# @leafcuttr/libgraphit-react

React adapter for the Grafana Chart.js Renderer.

## Installation

```bash
npm install @leafcuttr/libgraphit-react @leafcuttr/libgraphit-core chart.js chartjs-plugin-datasource-prometheus chartjs-adapter-date-fns date-fns
```

## Usage

This package provides two ways to render Grafana visualizations:

1.  **[`<GrafanaDashboard>`](#grafanadashboard-component)**: A component that renders an entire Grafana dashboard with a grid layout.
2.  **[`<GrafanaPanel>`](#grafanapanel-component)**: A component for rendering a single Grafana panel.

---

### `<GrafanaDashboard>` Component

This component renders a full Grafana dashboard, including its grid layout.

**Usage**

```tsx
import { GrafanaDashboard } from '@leafcuttr/libgraphit-react';
import type { GrafanaDashboard as GrafanaDashboardType } from '@leafcuttr/libgraphit-core';
import dashboardData from './my-dashboard.json';

function App() {
  return (
    <GrafanaDashboard
      dashboardJson={dashboardData as GrafanaDashboardType}
      prometheusUrl="http://localhost:9090"
      theme="dark"
    />
  );
}
```

---

### `<GrafanaPanel>` Component

This component renders a single Grafana panel.

**Usage**

```tsx
import { GrafanaPanel } from '@leafcuttr/libgraphit-react';
import type { Panel } from '@leafcuttr/libgraphit-core';
import panelData from './my-panel.json';

function App() {
  return (
    <GrafanaPanel
      panelJson={panelData as Panel}
      prometheusUrl="http://localhost:9090"
      theme="light"
      width="100%"
      height="400px"
    />
  );
}
```

---

## Component Props

### `<GrafanaDashboard>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dashboardJson` | `GrafanaDashboard` | required | The Grafana dashboard JSON object. |
| `prometheusUrl` | `string` | required | URL of the Prometheus server. |
| `timeRange` | `{ start: number, end: number }` | `undefined` | Time range for queries. If not provided, it's inferred from the dashboard JSON. |
| `theme` | `'light' \| 'dark'` | `'light'` | Chart theme. |
| `refreshInterval` | `number` | `undefined` | Auto-refresh interval in milliseconds. |
| `queryHandler` | `QueryHandler` | `undefined` | A custom function to handle data fetching. |
| `className` | `string` | `''` | Additional CSS classes for the container. |

### `<GrafanaPanel>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `panelJson` | `Panel` | required | The Grafana panel JSON configuration |
| `prometheusUrl` | `string` | required | URL of the Prometheus server |
| `timeRange` | `{from: string, to: string}` | `undefined` | Time range for queries |
| `theme` | `'light' \| 'dark'` | `'light'` | Chart theme |
| `refreshInterval` | `number` | `undefined` | Auto-refresh interval in milliseconds |
| `width` | `string` | `'100%'` | Chart container width |
| `height` | `string` | `'400px'` | Chart container height |
| `className` | `string` | `''` | Additional CSS classes |

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
