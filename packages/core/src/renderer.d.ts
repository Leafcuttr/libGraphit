import type { GrafanaPanel, GrafanaRendererOptions, RendererResult } from './types';
/**
 * Main Grafana Renderer
 * Orchestrates the parsing, mapping, and rendering process
 */
export declare class GrafanaRenderer {
    private chart;
    private canvas;
    private options;
    constructor(canvas: HTMLCanvasElement, options: GrafanaRendererOptions);
    /**
     * Render a Grafana panel on the canvas
     */
    render(panelJson: GrafanaPanel): Promise<RendererResult>;
    /**
     * Update the chart with new options
     */
    update(newOptions?: Partial<GrafanaRendererOptions>): void;
    /**
     * Destroy the chart instance
     */
    destroy(): void;
    /**
     * Static method for quick rendering
     */
    static renderPanel(canvas: HTMLCanvasElement, panelJson: GrafanaPanel, options: GrafanaRendererOptions): Promise<RendererResult>;
}
//# sourceMappingURL=renderer.d.ts.map