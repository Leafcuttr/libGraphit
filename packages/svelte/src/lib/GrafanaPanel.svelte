<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { GrafanaPanel, RendererResult } from '@grafana-renderer/core';
  import { GrafanaRenderer } from '@grafana-renderer/core';
  import type { GrafanaPanelProps } from './types';

  // Component props
  export let panelJson: GrafanaPanelProps['panelJson'];
  export let prometheusUrl: GrafanaPanelProps['prometheusUrl'];
  export let timeRange: GrafanaPanelProps['timeRange'] = undefined;
  export let theme: GrafanaPanelProps['theme'] = 'light';
  export let refreshInterval: GrafanaPanelProps['refreshInterval'] = undefined;
  export let width: GrafanaPanelProps['width'] = '100%';
  export let height: GrafanaPanelProps['height'] = '400px';
  export let queryHandler: GrafanaPanelProps['queryHandler'] = undefined;
  
  // Additional class for styling
  let className: GrafanaPanelProps['class'] = '';
  export { className as class };

  // Internal state
  let canvasElement: HTMLCanvasElement;
  let rendererResult: RendererResult | null = null;
  let loading = true;
  let error = '';

  // Mock data for development
  const mockPanelJson: GrafanaPanel = {
    id: 1,
    title: 'Mock Panel',
    type: 'timeseries',
    targets: [
      {
        expr: 'up',
        refId: 'A',
        legendFormat: 'Mock Metric'
      }
    ]
  };

  onMount(async () => {
    try {
      loading = true;
      error = '';

      // Use mock data if no real panel JSON provided
      const panelToRender = panelJson || mockPanelJson;
      
      // Mock Prometheus URL if not provided
      // const prometheusUrlToUse = prometheusUrl || 'http://localhost:9090';

      console.log('Mock: Rendering Grafana panel:', panelToRender);
      
      // Create renderer options
      const options = {
        prometheusUrl,
        timeRange,
        theme,
        refreshInterval,
        queryHandler,
      };

      console.log("options:", options);
      console.log("panelToRender:", panelToRender);

      // Initialize the renderer
      const renderer = new GrafanaRenderer(canvasElement, options);
      rendererResult = await renderer.render(panelToRender);

      console.log('Mock: Panel rendered successfully');
      loading = false;
    } catch (err) {
      console.error('Mock: Failed to render panel:', err);
      error = err instanceof Error ? err.message : 'Unknown error occurred';
      loading = false;
    }
  });

  onDestroy(() => {
    if (rendererResult) {
      rendererResult.destroy();
    }
  });

  // Update chart when props change
  $: if (rendererResult && (timeRange || theme || refreshInterval)) {
    rendererResult.update({
      timeRange,
      theme,
      refreshInterval,
    });
  }
</script>

<div 
  class="grafana-panel {className}"
  style="width: {width}; height: {height};"
>
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading chart...</p>
    </div>
  {:else if error}
    <div class="error">
      <h3>Error</h3>
      <p>{error}</p>
      <small>Check your panel JSON and Prometheus URL</small>
    </div>
  {/if}
  <canvas
    bind:this={canvasElement}
    class="chart-canvas"
    style="width: 100%; height: 100%;"
  ></canvas>
</div>

<style>
  .grafana-panel {
    position: relative;
    background: var(--bg-color, #ffffff);
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    overflow: hidden;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-color, #666);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border-color, #e0e0e0);
    border-top: 3px solid var(--accent-color, #007bff);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error {
    padding: 2rem;
    text-align: center;
    color: var(--error-color, #dc3545);
  }

  .error h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }

  .error p {
    margin: 0 0 0.5rem 0;
    font-weight: 500;
  }

  .error small {
    color: var(--text-muted, #6c757d);
  }

  .chart-canvas {
    display: block;
  }

  /* Dark theme support */
  :global(.dark) .grafana-panel {
    --bg-color: #1f1f1f;
    --border-color: #404040;
    --text-color: #ffffff;
    --text-muted: #adb5bd;
  }
</style>
