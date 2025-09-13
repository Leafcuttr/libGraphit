import { Chart, registerables } from 'chart.js';
import type { 
  GrafanaPanel, 
  GrafanaRendererOptions, 
  RendererResult,
  PrometheusChartConfig,
  QueryHandler,
  CustomQueryHandler
} from './types';
import type {ChartTypeRegistry} from "chart.js"
import ChartDatasourcePrometheusPlugin from 'chartjs-plugin-datasource-prometheus';

import 'chartjs-adapter-date-fns';

// Register Chart.js components
Chart.register(...registerables);

interface ParsedPanel {
  id: number;
  title: string;
  type: 'timeseries' | 'graph' | 'stat' | 'gauge' | 'table';
  queries: ParsedQuery[];
  unit?: string;
  displayName?: string;
  gridPos?: GrafanaPanel['gridPos'];
}

interface ParsedQuery {
  expr: string;
  refId: string;
  legendFormat?: string;
  interval?: string;
}

/**
 * Main Grafana Renderer
 * Orchestrates the parsing, mapping, and rendering process
 */
export class GrafanaRenderer {
  private chart: Chart | null = null;
  private canvas: HTMLCanvasElement;
  private options: GrafanaRendererOptions;

  private static readonly SUPPORTED_PANEL_TYPES = {
    TIMESERIES: 'timeseries',
    GRAPH: 'graph',
    STAT: 'stat',
    GAUGE: 'gauge',
    TABLE: 'table',
  } as const;

  private static readonly CHART_TYPE_MAPPING = {
    [GrafanaRenderer.SUPPORTED_PANEL_TYPES.TIMESERIES]: 'line',
    [GrafanaRenderer.SUPPORTED_PANEL_TYPES.GRAPH]: 'line',
    [GrafanaRenderer.SUPPORTED_PANEL_TYPES.STAT]: 'doughnut',
    [GrafanaRenderer.SUPPORTED_PANEL_TYPES.GAUGE]: 'doughnut',
    [GrafanaRenderer.SUPPORTED_PANEL_TYPES.TABLE]: 'bar',
  } as const;

  private static readonly PANEL_TYPE_MAPPING: Record<string, ParsedPanel['type']> = {
    'timeseries': 'timeseries',
    'graph': 'graph',
    'stat': 'stat',
    'gauge': 'gauge',
    'table': 'table',
  } as const;

  private static readonly DEFAULT_RENDERER_OPTIONS = {
    theme: 'light',
    refreshInterval: 30000,
    timeRange: {
      start: 0,
      end: 0,
    },
  } as const;

  private static readonly ERROR_MESSAGES = {
    INVALID_PANEL_JSON: 'Invalid Grafana panel JSON provided',
    UNSUPPORTED_PANEL_TYPE: 'Unsupported panel type',
    MISSING_PROMETHEUS_URL: 'Prometheus URL is required',
    CANVAS_NOT_FOUND: 'Canvas element not found or invalid',
    CHART_INIT_FAILED: 'Failed to initialize Chart.js instance',
  } as const;

  constructor(canvas: HTMLCanvasElement, options: GrafanaRendererOptions) {
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error(GrafanaRenderer.ERROR_MESSAGES.CANVAS_NOT_FOUND);
    }

    if (!options.prometheusUrl) {
      throw new Error(GrafanaRenderer.ERROR_MESSAGES.MISSING_PROMETHEUS_URL);
    }

    this.canvas = canvas;
    this.options = { ...GrafanaRenderer.DEFAULT_RENDERER_OPTIONS, ...options };
  }

  /**
   * Render a Grafana panel on the canvas
   */
  async render(panelJson: GrafanaPanel): Promise<RendererResult> {
    try {
      // Step 1: Parse the Grafana panel JSON
      const parsedPanel: ParsedPanel = this.parsePanel(panelJson);

      // Step 2: Map to Chart.js configuration and apply theme
      let chartConfig: PrometheusChartConfig = this.mapToChartConfig(parsedPanel, this.options);
      chartConfig = this.applyTheme(chartConfig, this.options.theme || 'light');

      // Step 3: Create Chart.js instance
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
      throw new Error(`${GrafanaRenderer.ERROR_MESSAGES.CHART_INIT_FAILED}: ${error}`);
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
   * Parse a Grafana panel JSON into our intermediate representation
   * (Previously GrafanaJsonParser.parsePanel)
   */
  private parsePanel(panelJson: GrafanaPanel): ParsedPanel {
    // Mock implementation - validate basic structure
    if (!panelJson || typeof panelJson !== 'object') {
      throw new Error(GrafanaRenderer.ERROR_MESSAGES.INVALID_PANEL_JSON);
    }

    if (!panelJson.id || !panelJson.title || !panelJson.type) {
      throw new Error(GrafanaRenderer.ERROR_MESSAGES.INVALID_PANEL_JSON);
    }

    // Check if panel type is supported
    const supportedTypes = Object.values(GrafanaRenderer.SUPPORTED_PANEL_TYPES);
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
      .filter(target => target.expr)
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
    return GrafanaRenderer.PANEL_TYPE_MAPPING[grafanaType] || 'timeseries';
  }

  /**
   * Map a parsed panel to Chart.js configuration
   * (Previously ChartConfigMapper.mapToChartConfig)
   */
  private mapToChartConfig(panel: ParsedPanel, options: GrafanaRendererOptions): PrometheusChartConfig {
    const chartType = this.getChartType(panel.type) as keyof ChartTypeRegistry;
    
    const config: PrometheusChartConfig = {
      type: chartType,
      data: {
        datasets: [],
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
          'datasource-prometheus': {
            prometheus: {
              endpoint: options.prometheusUrl,
              baseURL: "/"
            },
            query: this.makeCustomHandler((panel.queries[0]?.expr || ''), options.queryHandler),
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
    return GrafanaRenderer.CHART_TYPE_MAPPING[panelType] || 'line';
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
   * (Previously ChartConfigMapper.applyTheme)
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
      config.backgroundColor = colors.backgroundColor;
      config.color = colors.textColor;
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

  /**
   * Create custom query handler
   */
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
