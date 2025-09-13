# libGraphit SvelteKit Complete Example

This is a complete, runnable SvelteKit application demonstrating how to use **libGraphit** to render Grafana panels directly in your web application using Chart.js.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- (Optional) Running Prometheus instance

### Installation

1. **Clone and navigate to this example:**
   ```bash
   cd examples/complete
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to http://localhost:3000

## 📊 What's Included

This example includes four different pages demonstrating various aspects of libGraphit:

### 🏠 Home Page (`/`)
- Introduction to libGraphit
- Quick start guide
- Live example with a CPU usage chart
- Overview of all features

### 📈 Basic Usage (`/basic`)
- Minimal setup example
- Two simple charts (CPU and Memory usage)
- Code examples and explanations
- Guide for extracting panel JSON from Grafana

### ⚙️ Advanced Features (`/advanced`)
- Dynamic configuration controls
- Time range selection
- Theme switching (light/dark)
- Refresh interval controls
- Live updates demonstration

### 🗂️ Multi-Panel Dashboard (`/multi-panel`)
- Complete dashboard with 5 panels
- Synchronized time ranges
- Shared configuration across panels
- Responsive grid layout
- Dashboard-style controls

## 🛠️ Project Structure

```
examples/complete/
├── src/
│   ├── routes/                 # SvelteKit routes
│   │   ├── +layout.svelte     # Main layout with navigation
│   │   ├── +page.svelte       # Home page
│   │   ├── basic/             # Basic usage example
│   │   ├── advanced/          # Advanced features example
│   │   └── multi-panel/       # Multi-panel dashboard
│   ├── lib/
│   │   ├── panels.ts          # Sample panel configurations
│   │   └── stores.ts          # Svelte stores for state management
│   └── app.css                # Global styles
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── svelte.config.js          # Svelte configuration
└── README.md                 # This file
```

## 📋 Sample Panel Configurations

The example includes several pre-configured panels:

- **CPU Usage**: System CPU utilization over time
- **Memory Usage**: Memory consumption percentage
- **Disk I/O**: Read/write operations per second
- **Network Traffic**: Network bytes sent/received
- **System Uptime**: Server uptime statistics

All panels use realistic Prometheus queries that work with [node_exporter](https://github.com/prometheus/node_exporter) metrics.

## 🔧 Configuration

### Prometheus Setup

If you have a Prometheus server running with node_exporter metrics, update the Prometheus URL in the application:

1. Go to any example page
2. Look for "Prometheus URL" in the configuration
3. Update it to point to your Prometheus instance

### Without Prometheus

The examples work even without a real Prometheus server! The GrafanaPanel component includes mock data that demonstrates the functionality.

### Environment Variables

You can set default values using environment variables:

```bash
# .env.local
VITE_PROMETHEUS_URL=http://your-prometheus:9090
VITE_DEFAULT_THEME=dark
VITE_REFRESH_INTERVAL=60
```

## 🎨 Styling and Themes

The example includes:

- **Light and Dark themes** with CSS custom properties
- **Responsive design** that works on mobile and desktop
- **Bootstrap-inspired** component styling
- **Consistent visual hierarchy** across all pages

### Customizing Styles

All styles are in `src/app.css` using CSS custom properties. You can easily customize:

```css
:root {
  --primary-color: #your-brand-color;
  --background-color: #your-background;
  /* ... other variables */
}
```

## 📚 Usage Examples

### Basic Panel

```svelte
<script>
  import { GrafanaPanel } from '@leafcuttr/libgraphit-svelte';
  
  const panelJson = {
    id: 1,
    title: 'My Chart',
    type: 'timeseries',
    targets: [{
      expr: 'up',
      refId: 'A'
    }]
  };
</script>

<GrafanaPanel 
  panelJson={panelJson} 
  prometheusUrl="http://localhost:9090"
/>
```

### Advanced Panel with All Options

```svelte
<script>
  import { GrafanaPanel } from '@leafcuttr/libgraphit-svelte';
  import { writable } from 'svelte/store';
  
  const timeRange = writable({ from: 'now-1h', to: 'now' });
  const theme = writable('light');
  
  const panelJson = { /* your panel config */ };
</script>

<GrafanaPanel 
  panelJson={panelJson}
  prometheusUrl="http://localhost:9090"
  timeRange={$timeRange}
  theme={$theme}
  refreshInterval={30}
  width="100%"
  height="400px"
  class="my-custom-class"
/>
```

### Dashboard with Multiple Panels

```svelte
<script>
  import { GrafanaPanel } from '@leafcuttr/libgraphit-svelte';
  
  const panels = [
    { id: 1, title: 'CPU', /* ... */ },
    { id: 2, title: 'Memory', /* ... */ },
    // ... more panels
  ];
  
  const sharedConfig = {
    prometheusUrl: 'http://localhost:9090',
    timeRange: { from: 'now-1h', to: 'now' },
    theme: 'light',
    refreshInterval: 30
  };
</script>

<div class="dashboard-grid">
  {#each panels as panel (panel.id)}
    <div class="panel">
      <h3>{panel.title}</h3>
      <GrafanaPanel panelJson={panel} {...sharedConfig} />
    </div>
  {/each}
</div>
```

## 🔍 Getting Panel JSON from Grafana

To use your own Grafana panels:

1. **Open your Grafana dashboard**
2. **Click the settings gear icon** (⚙️) in the top right
3. **Select "JSON Model"** from the left sidebar
4. **Find your panel** in the `panels` array
5. **Copy the panel object** and use it as `panelJson`

Alternatively, for individual panels:
1. **Click on the panel title**
2. **Select "More" → "Panel JSON"**
3. **Copy the configuration**

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run check    # Run TypeScript checks
npm run lint     # Run linting
npm run format   # Format code
```

### Adding New Examples

1. Create a new route in `src/routes/`
2. Add navigation link in `src/routes/+layout.svelte`
3. Create panel configurations in `src/lib/panels.ts`
4. Add any new stores to `src/lib/stores.ts`

### Customizing Panel Configurations

Edit `src/lib/panels.ts` to:
- Add new panel types
- Modify existing queries
- Change chart options
- Update field configurations

## 🐛 Troubleshooting

### Charts Not Loading

1. **Check browser console** for error messages
2. **Verify Prometheus URL** is accessible
3. **Ensure panel JSON** is valid Grafana format
4. **Check network requests** in browser dev tools

### TypeScript Errors

1. **Run type checking**: `npm run check`
2. **Check imports** match the actual exports
3. **Verify** you have the latest libGraphit packages

### Styling Issues

1. **Check CSS custom properties** are defined
2. **Verify** dark/light theme classes are applied
3. **Test** responsive breakpoints

## 📖 Learn More

- **libGraphit Documentation**: [Main README](../../README.md)
- **Grafana Panel Reference**: [Grafana Docs](https://grafana.com/docs/grafana/latest/panels/)
- **Chart.js Documentation**: [Chart.js](https://www.chartjs.org/docs/)
- **SvelteKit Guide**: [SvelteKit Docs](https://kit.svelte.dev/docs)

## 🤝 Contributing

This example is part of the libGraphit project. Contributions are welcome!

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - see the main project LICENSE file for details.