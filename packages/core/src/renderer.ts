import { Chart, registerables } from 'chart.js';
import type { 
  GrafanaPanel, 
  GrafanaRendererOptions, 
  RendererResult,
  ParsedPanel,
  PrometheusChartConfig 
} from './types';
import { GrafanaJsonParser } from './parser';
import { ChartConfigMapper } from './mapper';
import { DEFAULT_RENDERER_OPTIONS, ERROR_MESSAGES } from './constants';

import 'chartjs-adapter-date-fns';

// Register Chart.js components
Chart.register(...registerables);

/**
 * Main Grafana Renderer
 * Orchestrates the parsing, mapping, and rendering process
 */
export class GrafanaRenderer {
  private chart: Chart | null = null;
  private canvas: HTMLCanvasElement;
  private options: GrafanaRendererOptions;

  constructor(canvas: HTMLCanvasElement, options: GrafanaRendererOptions) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error(ERROR_MESSAGES.CANVAS_NOT_FOUND);
    }

    if (!options.prometheusUrl) {
      throw new Error(ERROR_MESSAGES.MISSING_PROMETHEUS_URL);
    }

    this.canvas = canvas;
    this.options = { ...DEFAULT_RENDERER_OPTIONS, ...options };
  }

  /**
   * Render a Grafana panel on the canvas
   */
  async render(panelJson: GrafanaPanel): Promise<RendererResult> {
    try {
      // Step 1: Parse the Grafana panel JSON
      const parsedPanel: ParsedPanel = GrafanaJsonParser.parsePanel(panelJson);

      // Step 2: Map to Chart.js configuration
      let chartConfig: PrometheusChartConfig = ChartConfigMapper.mapToChartConfig(
        parsedPanel,
        this.options
      );

      // Step 3: Apply theme
      chartConfig = ChartConfigMapper.applyTheme(chartConfig, this.options.theme || 'light');

      // Step 4: Create Chart.js instance
      this.chart = new Chart(this.canvas, chartConfig);

      // Mock: Log the configuration for debugging
      console.log('Mock Chart.js config:', chartConfig);
      console.log('Mock Chart instance created:', this.chart);

      // Return renderer result with control methods
      return {
        chart: this.chart,
        destroy: () => this.destroy(),
        update: (newOptions) => this.update(newOptions),
      };
    } catch (error) {
      throw new Error(`${ERROR_MESSAGES.CHART_INIT_FAILED}: ${error}`);
    }
  }

  /**
   * Update the chart with new options
   */
  update(newOptions?: Partial<GrafanaRendererOptions>): void {
    if (!this.chart) {
      console.warn('No chart instance to update');
      return;
    }

    // Update options
    if (newOptions) {
      this.options = { ...this.options, ...newOptions };
    }

    // Mock update - in real implementation, this would update the chart
    console.log('Mock: Updating chart with options:', this.options);
    
    // Trigger chart update
    this.chart.update();
  }

  /**
   * Destroy the chart instance
   */
  destroy(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
      console.log('Mock: Chart instance destroyed');
    }
  }

  /**
   * Static method for quick rendering
   */
  static async renderPanel(
    canvas: HTMLCanvasElement,
    panelJson: GrafanaPanel,
    options: GrafanaRendererOptions
  ): Promise<RendererResult> {
    const renderer = new GrafanaRenderer(canvas, options);
    return renderer.render(panelJson);
  }
}