import type { Chart, ChartConfiguration } from 'chart.js';

// Grafana panel JSON structure (simplified for initial implementation)
export interface GrafanaPanel {
  id: number;
  title: string;
  type: string;
  targets: GrafanaTarget[];
  fieldConfig?: {
    defaults?: {
      unit?: string;
      displayName?: string;
    };
  };
  options?: Record<string, any>;
  gridPos?: {
    h: number;
    w: number;
    x: number;
    y: number;
  };
}

export interface GrafanaTarget {
  expr: string; // PromQL query
  refId: string;
  legendFormat?: string;
  interval?: string;
}

export interface GrafanaDashboard {
  panels: GrafanaPanel[];
  time?: {
    from: string;
    to: string;
  };
  templating?: {
    list: any[];
  };
}

// Renderer configuration options
export interface GrafanaRendererOptions {
  prometheusUrl: string;
  timeRange?: {
    start: number;
    end: number;
  };
  theme?: 'light' | 'dark';
  refreshInterval?: number;
}

// Chart.js configuration with Prometheus plugin
export interface PrometheusChartConfig extends ChartConfiguration {
  options: ChartConfiguration['options'] & {
    plugins?: {
      'datasource-prometheus'?: {
        // Add required properties
        prometheus: {
          endpoint: string;  // The Prometheus server URL
          baseURL: string; // Base URL for the Prometheus API
        }
        query: string;     // The PromQL query
        timeRange?: {
          type: 'relative' | 'absolute';
          start: number // string;
          end: number // string;
        };
      };
    };
  };
}

// Parsed panel data (intermediate representation)
export interface ParsedPanel {
  id: number;
  title: string;
  type: 'timeseries' | 'graph' | 'stat' | 'gauge' | 'table';
  queries: ParsedQuery[];
  unit?: string;
  displayName?: string;
  gridPos?: GrafanaPanel['gridPos'];
}

export interface ParsedQuery {
  expr: string;
  refId: string;
  legendFormat?: string;
  interval?: string;
}

// Renderer result
export interface RendererResult {
  chart: Chart;
  destroy: () => void;
  update: (options?: Partial<GrafanaRendererOptions>) => void;
}