// Supported Grafana panel types
export const SUPPORTED_PANEL_TYPES = {
  TIMESERIES: 'timeseries',
  GRAPH: 'graph',
  STAT: 'stat',
  GAUGE: 'gauge',
  TABLE: 'table',
} as const;

// Chart.js type mappings
export const CHART_TYPE_MAPPING = {
  [SUPPORTED_PANEL_TYPES.TIMESERIES]: 'line',
  [SUPPORTED_PANEL_TYPES.GRAPH]: 'line',
  [SUPPORTED_PANEL_TYPES.STAT]: 'doughnut',
  [SUPPORTED_PANEL_TYPES.GAUGE]: 'doughnut',
  [SUPPORTED_PANEL_TYPES.TABLE]: 'bar', // Fallback - tables need custom handling
} as const;

// Default renderer options
export const DEFAULT_RENDERER_OPTIONS = {
  theme: 'light',
  refreshInterval: 30000, // 30 seconds
  timeRange: {
    // from: 'now-1h',
    // to: 'now',
    start: 0, // Default to current time
    end: 0, // Default to current time
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_PANEL_JSON: 'Invalid Grafana panel JSON provided',
  UNSUPPORTED_PANEL_TYPE: 'Unsupported panel type',
  MISSING_PROMETHEUS_URL: 'Prometheus URL is required',
  CANVAS_NOT_FOUND: 'Canvas element not found or invalid',
  CHART_INIT_FAILED: 'Failed to initialize Chart.js instance',
} as const;