<script lang="ts">
  import { GrafanaPanel } from '@grafana-renderer/svelte';
  import { allPanels } from '$lib/panels';
  import { prometheusUrl, timeRange, theme, refreshInterval } from '$lib/stores';
</script>

<svelte:head>
  <title>Multi-Panel Dashboard - libGraphit SvelteKit Example</title>
</svelte:head>

<div class="card">
  <div class="card-header">
    Multi-Panel Dashboard Example
  </div>
  <div class="card-body">
    <p>
      This page demonstrates how to create a complete dashboard with multiple 
      panels, similar to what you would see in Grafana. All panels share the 
      same configuration (time range, theme, refresh interval) and update 
      synchronously.
    </p>

    <div class="alert alert-info">
      <strong>Dashboard Features:</strong>
      <ul style="margin: 0.5rem 0 0 0;">
        <li>Synchronized time ranges across all panels</li>
        <li>Shared theme switching</li>
        <li>Coordinated refresh intervals</li>
        <li>Responsive grid layout</li>
        <li>Individual panel loading states</li>
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
      <div>
        <label class="form-label" style="margin-bottom: 0.25rem;">Time Range:</label>
        <select 
          class="form-control" 
          style="width: auto; display: inline-block;"
          on:change={(e) => {
            const value = e.target.value;
            if (value === 'custom') return;
            timeRange.set({ from: value, to: 'now' });
          }}
        >
          <option value="now-15m">Last 15 minutes</option>
          <option value="now-1h" selected>Last 1 hour</option>
          <option value="now-6h">Last 6 hours</option>
          <option value="now-24h">Last 24 hours</option>
          <option value="now-7d">Last 7 days</option>
        </select>
      </div>

      <div>
        <label class="form-label" style="margin-bottom: 0.25rem;">Refresh:</label>
        <select 
          class="form-control" 
          style="width: auto; display: inline-block;"
          on:change={(e) => refreshInterval.set(Number(e.target.value))}
        >
          <option value="0">Off</option>
          <option value="10">10s</option>
          <option value="30" selected>30s</option>
          <option value="60">1m</option>
          <option value="300">5m</option>
        </select>
      </div>

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

<!-- Dashboard Grid -->
<div class="grid grid-2">
  {#each allPanels as panel (panel.id)}
    <div class="card">
      <div class="card-header">
        {panel.title}
        <small style="float: right; font-weight: normal;">
          Panel ID: {panel.id}
        </small>
      </div>
      <div class="card-body">
        <div class="chart-container">
          <GrafanaPanel 
            panelJson={panel} 
            prometheusUrl={$prometheusUrl}
            timeRange={$timeRange}
            theme={$theme}
            refreshInterval={$refreshInterval}
            width="100%"
            height="350px"
          />
        </div>
      </div>
    </div>
  {/each}
</div>

<div class="card">
  <div class="card-header">
    Implementation Code
  </div>
  <div class="card-body">
    <p>Here's how to implement a multi-panel dashboard:</p>
    
    <div class="code">
{`<script>
  import { GrafanaPanel } from '@grafana-renderer/svelte';
  import { writable } from 'svelte/store';

  // Shared configuration stores
  const prometheusUrl = writable('http://localhost:9090');
  const timeRange = writable({ from: 'now-1h', to: 'now' });
  const theme = writable('light');
  const refreshInterval = writable(30);

  // Array of panel configurations
  const panels = [
    { id: 1, title: 'CPU Usage', type: 'timeseries', targets: [...] },
    { id: 2, title: 'Memory Usage', type: 'timeseries', targets: [...] },
    { id: 3, title: 'Disk I/O', type: 'timeseries', targets: [...] },
    // ... more panels
  ];
</script>

<!-- Dashboard controls -->
<div class="dashboard-controls">
  <select on:change={(e) => timeRange.set({ from: e.target.value, to: 'now' })}>
    <option value="now-1h">Last 1 hour</option>
    <option value="now-24h">Last 24 hours</option>
  </select>
  
  <button on:click={theme.toggle}>
    Toggle Theme
  </button>
</div>

<!-- Panel grid -->
<div class="dashboard-grid">
  {#each panels as panel (panel.id)}
    <div class="panel-container">
      <h3>{panel.title}</h3>
      <GrafanaPanel 
        panelJson={panel}
        prometheusUrl={$prometheusUrl}
        timeRange={$timeRange}
        theme={$theme}
        refreshInterval={$refreshInterval}
      />
    </div>
  {/each}
</div>`}
    </div>

    <h3>Dashboard Benefits</h3>
    <ul>
      <li><strong>Consistency:</strong> All panels use the same time range and refresh settings</li>
      <li><strong>Performance:</strong> Efficient rendering with individual panel optimization</li>
      <li><strong>Flexibility:</strong> Easy to add, remove, or rearrange panels</li>
      <li><strong>User Experience:</strong> Familiar dashboard interface</li>
      <li><strong>Responsive:</strong> Adapts to different screen sizes</li>
    </ul>

    <h3>Panel Configuration</h3>
    <p>Each panel in the dashboard is a standard Grafana panel configuration:</p>
    <ul>
      <li><strong>Unique ID:</strong> Each panel should have a unique identifier</li>
      <li><strong>Title:</strong> Displayed in the panel header</li>
      <li><strong>Type:</strong> Chart type (timeseries, stat, etc.)</li>
      <li><strong>Targets:</strong> Prometheus queries for data</li>
      <li><strong>Field Config:</strong> Units, formatting, thresholds</li>
      <li><strong>Options:</strong> Chart-specific display options</li>
    </ul>
  </div>
</div>