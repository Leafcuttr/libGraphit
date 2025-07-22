import type { GrafanaPanel, GrafanaRendererOptions } from '@grafana-renderer/core';

// Svelte component props
export interface GrafanaPanelProps {
  panelJson: GrafanaPanel;
  prometheusUrl: string;
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