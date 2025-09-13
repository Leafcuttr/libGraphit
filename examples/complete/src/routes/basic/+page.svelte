<script lang="ts">
  import { GrafanaPanel } from '@leafcuttr/libgraphit-svelte';
  import { cpuUsagePanel, memoryUsagePanel } from '$lib/panels';
  import { prometheusUrl } from '$lib/stores';
</script>

<svelte:head>
  <title>Basic Usage - libGraphit SvelteKit Example</title>
</svelte:head>

<div class="card">
  <div class="card-header">
    Basic Usage Example
  </div>
  <div class="card-body">
    <p>
      This page demonstrates the most basic usage of libGraphit with SvelteKit. 
      Simply import the <code>GrafanaPanel</code> component and pass it your 
      panel JSON configuration.
    </p>

    <h3>Usage</h3>
    <div class="code">
{`<script>
  import { GrafanaPanel } from '@leafcuttr/libgraphit-svelte';
  
  const panelJson = {
    id: 1,
    title: 'CPU Usage Over Time',
    type: 'timeseries',
    targets: [
      {
        expr: '100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)',
        refId: 'A',
        legendFormat: '{{instance}} CPU Usage'
      }
    ],
    fieldConfig: {
      defaults: {
        unit: 'percent',
        min: 0,
        max: 100
      }
    }
  };
</script>

<GrafanaPanel 
  panelJson={panelJson} 
  prometheusUrl="http://localhost:9090"
/>`}
    </div>

    <h3>Required Props</h3>
    <ul>
      <li><strong>panelJson:</strong> Your Grafana panel configuration (JSON object)</li>
      <li><strong>prometheusUrl:</strong> URL to your Prometheus server</li>
    </ul>

    <h3>Optional Props</h3>
    <ul>
      <li><strong>width:</strong> Chart width (default: "100%")</li>
      <li><strong>height:</strong> Chart height (default: "400px")</li>
      <li><strong>theme:</strong> "light" or "dark" (default: "light")</li>
      <li><strong>timeRange:</strong> Custom time range object</li>
      <li><strong>refreshInterval:</strong> Auto-refresh interval in seconds</li>
    </ul>
  </div>
</div>

<div class="grid grid-2">
  <div class="card">
    <div class="card-header">
      CPU Usage Chart
    </div>
    <div class="card-body">
      <div class="chart-container">
        <GrafanaPanel 
          panelJson={cpuUsagePanel} 
          prometheusUrl={$prometheusUrl}
        />
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      Memory Usage Chart
    </div>
    <div class="card-body">
      <div class="chart-container">
        <GrafanaPanel 
          panelJson={memoryUsagePanel} 
          prometheusUrl={$prometheusUrl}
        />
      </div>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-header">
    Getting Panel JSON from Grafana
  </div>
  <div class="card-body">
    <p>To get the panel JSON configuration from your existing Grafana dashboard:</p>
    <ol>
      <li>Open your Grafana dashboard</li>
      <li>Click the settings gear icon (⚙️) in the top right</li>
      <li>Select "JSON Model" from the left sidebar</li>
      <li>Find your panel in the <code>panels</code> array</li>
      <li>Copy the panel object and use it as <code>panelJson</code></li>
    </ol>

    <div class="alert alert-info">
      <strong>Tip:</strong> You can also export individual panels by clicking 
      on the panel title, selecting "More" → "Panel JSON", and copying the 
      configuration.
    </div>
  </div>
</div>