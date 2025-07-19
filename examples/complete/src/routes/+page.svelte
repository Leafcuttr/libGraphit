<script lang="ts">
  import { GrafanaPanel } from '@grafana-renderer/svelte';
  import { cpuUsagePanel } from '$lib/panels';
  import { prometheusUrl } from '$lib/stores';
</script>

<svelte:head>
  <title>libGraphit SvelteKit Example</title>
</svelte:head>

<div class="card">
  <div class="card-header">
    Welcome to libGraphit SvelteKit Example
  </div>
  <div class="card-body">
    <p>
      This is a complete, runnable example demonstrating how to use 
      <strong>libGraphit</strong> with SvelteKit to render Grafana panels 
      directly in your web application.
    </p>
    
    <h3>What is libGraphit?</h3>
    <p>
      libGraphit is a lightweight, embeddable, framework-agnostic library 
      that renders Grafana panels using Chart.js. It allows you to reuse 
      your existing Grafana dashboard configurations without iframes.
    </p>

    <h3>Quick Start</h3>
    <ol>
      <li>
        <strong>Install dependencies:</strong>
        <div class="code">npm install</div>
      </li>
      <li>
        <strong>Start your Prometheus server</strong> (if not already running):
        <div class="code">docker run -p 9090:9090 prom/prometheus</div>
      </li>
      <li>
        <strong>Start the development server:</strong>
        <div class="code">npm run dev</div>
      </li>
      <li>
        <strong>Open your browser</strong> and navigate through the examples!
      </li>
    </ol>

    <div class="alert alert-info">
      <strong>Note:</strong> This example will work even without a real Prometheus 
      server running. The GrafanaPanel component includes mock data for 
      demonstration purposes.
    </div>
  </div>
</div>

<div class="card">
  <div class="card-header">
    Live Example - CPU Usage Chart
  </div>
  <div class="card-body">
    <p>Here's a live example of a Grafana panel rendered with libGraphit:</p>
    
    <div class="chart-container">
      <GrafanaPanel 
        panelJson={cpuUsagePanel} 
        prometheusUrl={$prometheusUrl}
        timeRange={{ type: 'relative', start: -12 * 60 * 60 * 1000, end: 0 }}
        width="100%"
        height="400px"
      />
    </div>

    <details>
      <summary style="cursor: pointer; font-weight: 500; margin-bottom: 1rem;">
        View Panel Configuration
      </summary>
      <div class="code">
        {JSON.stringify(cpuUsagePanel, null, 2)}
      </div>
    </details>
  </div>
</div>

<div class="card">
  <div class="card-header">
    Examples in this Demo
  </div>
  <div class="card-body">
    <div class="grid grid-3">
      <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 0.25rem;">
        <h4><a href="/basic">Basic Usage</a></h4>
        <p>Simple example showing how to render a single Grafana panel with minimal configuration.</p>
      </div>
      
      <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 0.25rem;">
        <h4><a href="/advanced">Advanced Features</a></h4>
        <p>Demonstrates advanced features like time range controls, theme switching, and real-time updates.</p>
      </div>
      
      <div style="padding: 1rem; border: 1px solid var(--border-color); border-radius: 0.25rem;">
        <h4><a href="/multi-panel">Multi-Panel Dashboard</a></h4>
        <p>Shows how to create a complete dashboard with multiple panels, just like in Grafana.</p>
      </div>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-header">
    Key Features
  </div>
  <div class="card-body">
    <ul>
      <li><strong>Framework Agnostic:</strong> Core library works with any JavaScript framework</li>
      <li><strong>SvelteKit Ready:</strong> Pre-built Svelte components for easy integration</li>
      <li><strong>TypeScript Support:</strong> Fully typed for better development experience</li>
      <li><strong>Live Data:</strong> Connects directly to your Prometheus instance</li>
      <li><strong>Theme Support:</strong> Light and dark themes out of the box</li>
      <li><strong>Responsive:</strong> Charts adapt to container size changes</li>
    </ul>
  </div>
</div>