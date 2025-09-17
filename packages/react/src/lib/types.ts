import type { GrafanaPanel, GrafanaDashboard, QueryHandler } from '@leafcuttr/libgraphit-core';

// React component props
export interface GrafanaPanelProps {
  panelJson: GrafanaPanel;
  prometheusUrl?: string;
  timeRange?: {
    start: number,
    end: number,
    step?: number
  };
  theme?: 'light' | 'dark';
  refreshInterval?: number;
  width?: string;
  height?: string;
  className?: string;
  queryHandler?: QueryHandler;
}

// Dashboard component props
export interface GrafanaDashboardProps {
  dashboardJson: GrafanaDashboard;
  prometheusUrl?: string;
  timeRange?: {
    start: number,
    end: number,
    step?: number
  };
  theme?: 'light' | 'dark';
  refreshInterval?: number;
  className?: string;
  queryHandler?: QueryHandler;
}
