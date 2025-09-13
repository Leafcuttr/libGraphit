<script lang="ts">
  import GrafanaPanel from './GrafanaPanel.svelte';
  import type { GrafanaDashboard } from '@leafcuttr/libgraphit-core';
  import type { GrafanaDashboardProps } from './types';

  export let dashboardJson: GrafanaDashboardProps['dashboardJson'];
  export let prometheusUrl: GrafanaDashboardProps['prometheusUrl'];
  export let timeRange: GrafanaDashboardProps['timeRange'] = undefined;
  export let theme: GrafanaDashboardProps['theme'] = 'light';
  export let refreshInterval: GrafanaDashboardProps['refreshInterval'] = undefined;
  export let queryHandler: GrafanaDashboardProps['queryHandler'] = undefined;
  
  let className: GrafanaDashboardProps['class'] = '';
  export { className as class };

  $: panels = dashboardJson?.panels || [];
  
  $: dashboardTimeRange = timeRange || (dashboardJson?.time ? {
    start: dashboardJson.time.from === 'now-1h' ? Date.now() - 3600000 : 
           dashboardJson.time.from === 'now-6h' ? Date.now() - 21600000 :
           dashboardJson.time.from === 'now-24h' ? Date.now() - 86400000 :
           dashboardJson.time.from === 'now-7d' ? Date.now() - 604800000 :
           dashboardJson.time.from === 'now-30d' ? Date.now() - 2592000000 :
           Date.now() - 3600000,
    end: Date.now(),
  } : undefined);

  $: gridWidth = Math.max(...panels.map(p => (p.gridPos?.x || 0) + (p.gridPos?.w || 12)), 24);
  $: gridHeight = Math.max(...panels.map(p => (p.gridPos?.y || 0) + (p.gridPos?.h || 8)), 8);
</script>

<div 
  class="grafana-dashboard {className}"
  style="
    display: grid;
    grid-template-columns: repeat({gridWidth}, 1fr);
    grid-template-rows: repeat({gridHeight}, 50px);
    gap: 8px;
    padding: 16px;
  "
>
  {#each panels as panel (panel.id)}
    <div
      class="dashboard-panel"
      style="
        grid-column: {(panel.gridPos?.x || 0) + 1} / {(panel.gridPos?.x || 0) + (panel.gridPos?.w || 12) + 1};
        grid-row: {(panel.gridPos?.y || 0) + 1} / {(panel.gridPos?.y || 0) + (panel.gridPos?.h || 8) + 1};
      "
    >
      <GrafanaPanel
        panelJson={panel}
        {prometheusUrl}
        timeRange={dashboardTimeRange}
        {theme}
        {refreshInterval}
        {queryHandler}
        width="100%"
        height="100%"
      />
    </div>
  {/each}
</div>

<style>
  .grafana-dashboard {
    background: var(--bg-color, #f8f9fa);
    min-height: 400px;
  }

  .dashboard-panel {
    background: var(--panel-bg-color, #ffffff);
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    overflow: hidden;
  }

  :global(.dark) .grafana-dashboard {
    --bg-color: #1a1a1a;
    --panel-bg-color: #2d2d2d;
    --border-color: #404040;
  }
</style>
