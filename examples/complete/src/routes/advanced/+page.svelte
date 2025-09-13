<script lang="ts">
  import { GrafanaPanel } from '@leafcuttr/libgraphit-svelte';
  import { diskIOPanel } from '$lib/panels';
  import { prometheusUrl, timeRange, theme, refreshInterval } from '$lib/stores';

  // Local state for form controls
  let localPrometheusUrl = $prometheusUrl;
  let localTimeFrom = $timeRange.from;
  let localTimeTo = $timeRange.to;
  let localRefreshInterval = $refreshInterval;

  // Update stores when form values change
  $: prometheusUrl.set(localPrometheusUrl);
  $: timeRange.set({ from: localTimeFrom, to: localTimeTo });
  $: refreshInterval.set(localRefreshInterval);
</script>

<svelte:head>
  <title>Advanced Features - libGraphit SvelteKit Example</title>
</svelte:head>

<div class="card">
  <div class="card-header">
    Advanced Features Example
  </div>
  <div class="card-body">
    <p>
      This page demonstrates advanced features of libGraphit including 
      dynamic configuration, time range controls, theme switching, and 
      real-time updates.
    </p>
  </div>
</div>

<div class="grid grid-2">
  <div class="card">
    <div class="card-header">
      Configuration Controls
    </div>
    <div class="card-body">
      <div class="form-group">
        <label class="form-label" for="prometheus-url">
          Prometheus URL
        </label>
        <input 
          id="prometheus-url"
          class="form-control" 
          type="url" 
          bind:value={localPrometheusUrl}
          placeholder="http://localhost:9090"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="time-from">
          Time Range From
        </label>
        <input 
          id="time-from"
          class="form-control" 
          type="text" 
          bind:value={localTimeFrom}
          placeholder="now-1h"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="time-to">
          Time Range To
        </label>
        <input 
          id="time-to"
          class="form-control" 
          type="text" 
          bind:value={localTimeTo}
          placeholder="now"
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="refresh-interval">
          Refresh Interval (seconds)
        </label>
        <input 
          id="refresh-interval"
          class="form-control" 
          type="number" 
          bind:value={localRefreshInterval}
          min="5"
          max="300"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Theme</label>
        <div>
          <button 
            class="btn btn-primary" 
            on:click={theme.toggle}
            style="margin-right: 0.5rem;"
          >
            Switch to {$theme === 'light' ? 'Dark' : 'Light'} Theme
          </button>
          <span>Current: {$theme}</span>
        </div>
      </div>

      <div class="alert alert-info">
        <strong>Live Updates:</strong> Changes to these controls will 
        immediately update the chart on the right!
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      Disk I/O Chart (Real-time)
    </div>
    <div class="card-body">
      <div class="chart-container">
        <GrafanaPanel 
          panelJson={diskIOPanel} 
          prometheusUrl={$prometheusUrl}
          timeRange={$timeRange}
          theme={$theme}
          refreshInterval={$refreshInterval}
          width="100%"
          height="400px"
        />
      </div>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-header">
    Advanced Component Code
  </div>
  <div class="card-body">
    <p>Here's how to use all the advanced features:</p>
    
    <div class="code">
{`<script>
  import { GrafanaPanel } from '@leafcuttr/libgraphit-svelte';
  import { writable } from 'svelte/store';

  // Reactive stores for configuration
  const prometheusUrl = writable('http://localhost:9090');
  const timeRange = writable({ from: 'now-1h', to: 'now' });
  const theme = writable('light');
  const refreshInterval = writable(30);

  const panelJson = {
    // Your panel configuration...
  };
</script>

<GrafanaPanel 
  panelJson={panelJson}
  prometheusUrl={$prometheusUrl}
  timeRange={$timeRange}
  theme={$theme}
  refreshInterval={$refreshInterval}
  width="100%"
  height="400px"
/>`}
    </div>

    <h3>Time Range Formats</h3>
    <p>You can use various formats for time ranges:</p>
    <ul>
      <li><strong>Relative:</strong> "now-1h", "now-24h", "now-7d", "now-30d"</li>
      <li><strong>Absolute:</strong> "2023-01-01T00:00:00Z"</li>
      <li><strong>Unix timestamp:</strong> Numbers are treated as Unix timestamps</li>
    </ul>

    <h3>Refresh Intervals</h3>
    <p>The refresh interval determines how often the chart updates with new data:</p>
    <ul>
      <li><strong>5-30 seconds:</strong> Good for real-time monitoring</li>
      <li><strong>30-60 seconds:</strong> Balanced performance and freshness</li>
      <li><strong>60+ seconds:</strong> Less resource intensive for historical data</li>
      <li><strong>undefined:</strong> No automatic refresh (manual refresh only)</li>
    </ul>
  </div>
</div>