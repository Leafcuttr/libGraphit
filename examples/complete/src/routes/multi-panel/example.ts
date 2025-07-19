
export const multiPanelExample = `// Store configuration
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
</div>`