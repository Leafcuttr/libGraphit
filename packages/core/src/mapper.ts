import type { ParsedPanel, PrometheusChartConfig, GrafanaRendererOptions } from './types';
import { CHART_TYPE_MAPPING } from './constants';

/**
 * Chart.js Configuration Mapper
 * Maps parsed Grafana panels to Chart.js configuration objects
 */
export class ChartConfigMapper {
  /**
   * Map a parsed panel to Chart.js configuration
   */
  static mapToChartConfig(
    panel: ParsedPanel,
    options: GrafanaRendererOptions
  ): PrometheusChartConfig {
    const chartType = this.getChartType(panel.type);
    
    // Mock implementation - basic Chart.js config with Prometheus plugin
    const config: PrometheusChartConfig = {
      type: chartType,
      data: {
        datasets: [], // Will be populated by the Prometheus plugin
      },
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
            url: options.prometheusUrl,
            query: panel.queries[0]?.expr || '', // Use first query for now
            timeRange: {
              type: 'relative',
              start: options.timeRange?.from || 'now-1h',
              end: options.timeRange?.to || 'now',
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
  private static getChartType(panelType: ParsedPanel['type']): string {
    return CHART_TYPE_MAPPING[panelType] || 'line';
  }

  /**
   * Configure chart scales based on panel type
   */
  private static getScalesConfig(panel: ParsedPanel, chartType: string): any {
    // Mock scales configuration
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

    // For non-timeseries charts, return basic scales
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
  static applyTheme(config: PrometheusChartConfig, theme: 'light' | 'dark'): PrometheusChartConfig {
    // Mock theme application
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

    // Apply theme to various chart elements
    if (config.options) {
      // Background color
      config.options.backgroundColor = colors.backgroundColor;
      
      // Text colors
      if (config.options.plugins?.title) {
        config.options.plugins.title.color = colors.textColor;
      }
      
      if (config.options.plugins?.legend) {
        config.options.plugins.legend.labels = {
          color: colors.textColor,
        };
      }

      // Grid colors
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
}