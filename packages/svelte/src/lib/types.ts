import type { GrafanaPanel, GrafanaRendererOptions, QueryHandler } from '@grafana-renderer/core';

// Svelte component props
export interface GrafanaPanelProps {
  panelJson: GrafanaPanel;
  prometheusUrl?: string;
  timeRange?: {
    start: number,
    end: number,
    step?: number
    // from: string;
    // to: string;
  };
  theme?: 'light' | 'dark';
  refreshInterval?: number;
  width?: string;
  height?: string;
  class?: string;
  queryHandler?: QueryHandler;
}

// Svelte action parameters
export interface GrafanaActionParams {
  panelJson: GrafanaPanel;
  options: GrafanaRendererOptions;
}

// Action result
export interface GrafanaActionResult {
  update?: (params: GrafanaActionParams) => void;
  destroy?: () => void;
}

// Dashboard component props
export interface GrafanaDashboardProps {
  dashboardJson: import('@grafana-renderer/core').GrafanaDashboard;
  prometheusUrl?: string;
  timeRange?: {
    start: number,
    end: number,
    step?: number
  };
  theme?: 'light' | 'dark';
  refreshInterval?: number;
  class?: string;
  queryHandler?: QueryHandler;
}
