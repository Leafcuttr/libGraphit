# Basic Usage Examples

## Core Library Usage

```typescript
import { GrafanaRenderer } from '@leafcuttr/libgraphit-core';

// Your Grafana panel JSON
const panelJson = {
  id: 1,
  title: 'CPU Usage',
  type: 'timeseries',
  targets: [
    {
      expr: 'cpu_usage_percent',
      refId: 'A',
      legendFormat: 'CPU Usage %'
    }
  ]
};

// Renderer options
const options = {
  prometheusUrl: 'http://localhost:9090',
  theme: 'light',
  timeRange: {
    from: 'now-1h',
    to: 'now'
  }
};

// Get canvas element
const canvas = document.getElementById('chart-canvas') as HTMLCanvasElement;

// Render the panel
const result = await GrafanaRenderer.renderPanel(canvas, panelJson, options);

// Use the chart instance
console.log('Chart created:', result.chart);

// Update the chart later
result.update({ theme: 'dark' });

// Clean up when done
result.destroy();
```

## Svelte Component Usage

```svelte
<script lang="ts">
  import { GrafanaPanel } from '@leafcuttr/libgraphit-svelte';
  import panelData from './my-panel.json';

  const prometheusUrl = 'http://localhost:9090';
</script>

<div class="dashboard">
  <h1>My Dashboard</h1>
  
  <div class="chart-container">
    <GrafanaPanel
      panelJson={panelData}
      {prometheusUrl}
      theme="light"
      width="100%"
      height="400px"
      timeRange={{
        from: 'now-6h',
        to: 'now'
      }}
    />
  </div>
</div>

<style>
  .dashboard {
    padding: 2rem;
  }
  
  .chart-container {
    margin: 2rem 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
  }
</style>
```

## Svelte Action Usage

```svelte
<script lang="ts">
  import { grafanaAction } from '@leafcuttr/libgraphit-svelte';
  import type { GrafanaPanel } from '@leafcuttr/libgraphit-core';

  const panelJson: GrafanaPanel = {
    id: 2,
    title: 'Memory Usage',
    type: 'timeseries',
    targets: [
      {
        expr: 'memory_usage_bytes',
        refId: 'A'
      }
    ]
  };

  const actionParams = {
    panelJson,
    options: {
      prometheusUrl: 'http://localhost:9090',
      theme: 'dark'
    }
  };
</script>

<div class="chart-wrapper">
  <canvas 
    use:grafanaAction={actionParams}
    width="800"
    height="400"
  ></canvas>
</div>
```