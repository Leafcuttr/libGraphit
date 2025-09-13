import type { GrafanaPanel, GrafanaRendererOptions } from '@leafcuttr/libgraphit-core';
export interface GrafanaPanelProps {
    panelJson: GrafanaPanel;
    prometheusUrl: string;
    timeRange?: {
        from: string;
        to: string;
    };
    theme?: 'light' | 'dark';
    refreshInterval?: number;
    width?: string;
    height?: string;
    class?: string;
}
export interface GrafanaActionParams {
    panelJson: GrafanaPanel;
    options: GrafanaRendererOptions;
}
export interface GrafanaActionResult {
    update?: (params: GrafanaActionParams) => void;
    destroy?: () => void;
}
//# sourceMappingURL=types.d.ts.map