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
    step?: number;
  };
  templating?: {
    list: any[];
  };
}

// Renderer configuration options
export interface GrafanaRendererOptions {
  prometheusUrl?: string;
  queryHandler?: QueryHandler
  timeRange?: {
    start: number;
    end: number;
    step?: number;
  };
  theme?: 'light' | 'dark';
  refreshInterval?: number;
}

export type QueryHandler = (query: string, start: Date, end: Date, step: number) => Promise<any>;
export type CustomQueryHandler = (start: Date, end: Date, step: number) => Promise<any>;

// Chart.js configuration with Prometheus plugin
export interface PrometheusChartConfig extends ChartConfiguration {
  backgroundColor?: string;
  color?: string;
  options: ChartConfiguration['options'] & {
    plugins?: {
      'datasource-prometheus'?: {
        prometheus: {
          endpoint?: string;
          baseURL: string;
        }
        query: string | CustomQueryHandler;
        timeRange?: {
          type: 'relative' | 'absolute';
          start: number;
          end: number;
          step?: number;
        };
      };
    };
  };
}

// Renderer result
export interface RendererResult {
  chart: Chart;
  destroy: () => void;
  update: (options?: Partial<GrafanaRendererOptions>) => void;
}
