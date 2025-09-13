<script lang="ts">
  import { GrafanaDashboard } from '@leafcuttr/libgraphit-svelte';
  import { prometheusUrl, theme, refreshInterval } from '$lib/stores';
  import sampleDashboard from '../../../../sample-dashboard.json';
</script>

<svelte:head>
  <title>Dashboard Component - libGraphit SvelteKit Example</title>
</svelte:head>

<div class="card">
  <div class="card-header">
    Dashboard Component Example
  </div>
  <div class="card-body">
    <p>
      This page demonstrates the new GrafanaDashboard component that accepts 
      an entire Grafana dashboard JSON and renders all panels with proper 
      grid layout based on gridPos properties.
    </p>
    
    <div class="alert alert-info">
      <strong>Dashboard Features:</strong>
      <ul style="margin: 0.5rem 0 0 0;">
        <li>Automatic grid layout using Grafana's 24-column system</li>
        <li>Panel positioning based on gridPos properties</li>
        <li>Dashboard-level time range passed to all panels</li>
        <li>Synchronized theme and refresh settings</li>
        <li>Responsive design that adapts to panel configurations</li>
      </ul>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-header">
    Dashboard Controls
  </div>
  <div class="card-body">
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
      <button 
        class="btn btn-secondary" 
        on:click={theme.toggle}
      >
        {$theme === 'light' ? '🌙 Dark' : '☀️ Light'} Theme
      </button>

      <div style="margin-left: auto; font-size: 0.875rem; color: var(--secondary-color);">
        Prometheus: {$prometheusUrl}
      </div>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-header">
    Sample Dashboard ({sampleDashboard.panels.length} panels)
  </div>
  <div class="card-body" style="padding: 0;">
    <GrafanaDashboard
      dashboardJson={sampleDashboard}
      prometheusUrl={$prometheusUrl}
      theme={$theme}
      refreshInterval={$refreshInterval}
    />
  </div>
</div>

<div class="card">
  <div class="card-header">
    Implementation Details
  </div>
  <div class="card-body">
    <h3>Dashboard JSON Structure</h3>
    <p>The component expects a dashboard JSON with the following structure:</p>
    <ul>
      <li><strong>panels:</strong> Array of panel configurations</li>
      <li><strong>time:</strong> Dashboard-level time range (optional)</li>
      <li><strong>templating:</strong> Dashboard variables (optional)</li>
    </ul>

    <h3>Grid Layout System</h3>
    <p>Uses Grafana's standard 24-column grid system:</p>
    <ul>
      <li><strong>gridPos.x:</strong> Horizontal position (0-23)</li>
      <li><strong>gridPos.w:</strong> Width in grid units (1-24)</li>
      <li><strong>gridPos.y:</strong> Vertical position (0+)</li>
      <li><strong>gridPos.h:</strong> Height in grid units</li>
    </ul>

    <h3>Usage Example</h3>
    <div class="code">
      <pre>{`<script>
  import { GrafanaDashboard } from '@leafcuttr/libgraphit-svelte';
  import dashboardJson from './my-dashboard.json';
</script>

<GrafanaDashboard
  dashboardJson={dashboardJson}
  prometheusUrl="http://localhost:9090"
  theme="light"
  refreshInterval={30}
/>`}</pre>
    </div>
  </div>
</div>
