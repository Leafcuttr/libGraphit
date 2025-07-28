import { Chart, registerables, ChartTypeRegistry } from 'chart.js';
import ChartDatasourcePrometheusPlugin from 'chartjs-plugin-datasource-prometheus';
import type {
  GrafanaPanel,
  GrafanaRendererOptions,
  RendererResult,
  ParsedPanel,
  PrometheusChartConfig,
  ParsedQuery,
  QueryHandler,
  CustomQueryHandler
} from './types';
import { DEFAULT_RENDERER_OPTIONS, ERROR_MESSAGES, SUPPORTED_PANEL_TYPES, CHART_TYPE_MAPPING } from './constants';

import 'chartjs-adapter-date-fns';

// Register Chart.js components
Chart.register(...registerables);

/**
 * GrafanaChart
 * A class that parses a Grafana panel JSON and renders it as a Chart.js chart.
 */
export class GrafanaChart {
  public chart: Chart | null = null;
  public canvas: HTMLCanvasElement;
  public options: GrafanaRendererOptions;
  public panel: GrafanaPanel;

  constructor(canvas: HTMLCanvasElement, panel: GrafanaPanel, options: GrafanaRendererOptions) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error(ERROR_MESSAGES.CANVAS_NOT_FOUND);
    }

    if (!options.prometheusUrl) {
      throw new Error(ERROR_MESSAGES.MISSING_PROMETHEUS_URL);
    }

    this.canvas = canvas;
    this.panel = panel;
    this.options = { ...DEFAULT_RENDERER_OPTIONS, ...options };

    this.render();
  }

  /**
   * Render a Grafana panel on the canvas
   */
  async render(): Promise<RendererResult> {
    try {
      // Step 1: Parse the Grafana panel JSON
      const parsedPanel: ParsedPanel = this.parsePanel(this.panel);

      // Step 2: Map to Chart.js configuration
      let chartConfig: PrometheusChartConfig = this.mapToChartConfig(
        parsedPanel,
        this.options
      );

      // Step 3: Apply theme
      chartConfig = this.applyTheme(chartConfig, this.options.theme || 'light');

      // Step 4: Create Chart.js instance
      this.chart = new Chart(this.canvas, chartConfig);

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
    }
  }

  /**
   * Parse a Grafana panel JSON into our intermediate representation
   */
  private parsePanel(panelJson: GrafanaPanel): ParsedPanel {
    if (!panelJson || typeof panelJson !== 'object') {
      throw new Error(ERROR_MESSAGES.INVALID_PANEL_JSON);
    }

    if (!panelJson.id || !panelJson.title || !panelJson.type) {
      throw new Error(ERROR_MESSAGES.INVALID_PANEL_JSON);
    }

    // Check if panel type is supported
    const supportedTypes = Object.values(SUPPORTED_PANEL_TYPES);
    if (!supportedTypes.includes(panelJson.type as any)) {
      console.warn(`Panel type "${panelJson.type}" is not fully supported yet. Falling back to timeseries.`);
    }

    // Parse queries
    const queries: ParsedQuery[] = this.parseQueries(panelJson.targets || []);

    // Extract panel configuration
    const parsedPanel: ParsedPanel = {
      id: panelJson.id,
      title: panelJson.title,
      type: this.mapPanelType(panelJson.type),
      queries,
      unit: panelJson.fieldConfig?.defaults?.unit,
      displayName: panelJson.fieldConfig?.defaults?.displayName,
      gridPos: panelJson.gridPos,
    };

    return parsedPanel;
  }

  /**
   * Parse Grafana targets into our query format
   */
  private parseQueries(targets: any[]): ParsedQuery[] {
    if (!Array.isArray(targets)) {
      return [];
    }

    return targets
      .filter(target => target.expr) // Only include targets with PromQL expressions
      .map(target => ({
        expr: target.expr,
        refId: target.refId || 'A',
        legendFormat: target.legendFormat,
        interval: target.interval,
      }));
  }

  /**
   * Map Grafana panel type to our supported types
   */
  private mapPanelType(grafanaType: string): ParsedPanel['type'] {
    switch (grafanaType) {
      case 'timeseries':
        return 'timeseries';
      case 'graph':
        return 'graph';
      case 'stat':
        return 'stat';
      case 'gauge':
        return 'gauge';
      case 'table':
        return 'table';
      default:
        // Default to timeseries for unsupported types
        return 'timeseries';
    }
  }

  /**
   * Map a parsed panel to Chart.js configuration
   */
  private mapToChartConfig(
    panel: ParsedPanel,
    options: GrafanaRendererOptions
  ): PrometheusChartConfig {
    const chartType = this.getChartType(panel.type) as keyof ChartTypeRegistry;

    const config: PrometheusChartConfig = {
      type: chartType,
      data: {
        datasets: [], // Will be populated by the Prometheus plugin
      },
      plugins: [ChartDatasourcePrometheusPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: panel.title,
          },
          legend: {
            display: true,
            position: 'bottom',
          },
          // Prometheus datasource plugin configuration
          'datasource-prometheus': {
            prometheus: {
              endpoint: options.prometheusUrl,
              baseURL: "/"
            },
            query: this.makeCustomHandler((panel.queries[0]?.expr || ''), options.queryHandler), // Use first query for now
            timeRange: {
              type: 'relative',
              start: options.timeRange?.start ?? -1*60*60*1000,
              end: options.timeRange?.end ?? 0,
              step: options.timeRange?.step ?? 60,
            },
          },
        },
        scales: this.getScalesConfig(panel, chartType),
      },
    };

    return config;
  }

  /**
   * Get Chart.js chart type from panel type
   */
  private getChartType(panelType: ParsedPanel['type']): string {
    return CHART_TYPE_MAPPING[panelType] || 'line';
  }

  /**
   * Configure chart scales based on panel type
   */
  private getScalesConfig(panel: ParsedPanel, chartType: string): any {
    if (chartType === 'line') {
      return {
        x: {
          type: 'time',
          time: {
            displayFormats: {
              minute: 'HH:mm',
              hour: 'HH:mm',
              day: 'MMM dd',
            },
          },
          title: {
            display: true,
            text: 'Time',
          },
        },
        y: {
          title: {
            display: true,
            text: panel.unit || 'Value',
          },
          beginAtZero: false,
        },
      };
    }

    return {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: panel.unit || 'Value',
        },
      },
    };
  }

  /**
   * Apply theme configuration to chart config
   */
  private applyTheme(config: PrometheusChartConfig, theme: 'light' | 'dark'): PrometheusChartConfig {
    const themeColors = {
      light: {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        gridColor: '#e0e0e0',
      },
      dark: {
        backgroundColor: '#1f1f1f',
        textColor: '#ffffff',
        gridColor: '#404040',
      },
    };

    const colors = themeColors[theme];

    if (config.options) {
      config.options.backgroundColor = colors.backgroundColor;

      if (config.options.plugins?.title) {
        config.options.plugins.title.color = colors.textColor;
      }

      if (config.options.plugins?.legend) {
        config.options.plugins.legend.labels = {
          color: colors.textColor,
        };
      }

      if (config.options.scales) {
        Object.values(config.options.scales).forEach((scale: any) => {
          if (scale.grid) {
            scale.grid.color = colors.gridColor;
          }
          if (scale.ticks) {
            scale.ticks.color = colors.textColor;
          }
          if (scale.title) {
            scale.title.color = colors.textColor;
          }
        });
      }
    }

    return config;
  }

  private makeCustomHandler(query: string, handler?: QueryHandler): CustomQueryHandler | string {
    if (!handler) return query;

    return async (start: Date, end: Date, step: number) => {
      try {
        const result = await handler(query, start, end, step);
        return result;
      } catch (error) {
        console.error('Error executing custom query handler:', error);
        throw error;
      }
    };
  }
}
