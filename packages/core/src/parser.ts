import type { GrafanaPanel, ParsedPanel, ParsedQuery } from './types';
import { SUPPORTED_PANEL_TYPES, ERROR_MESSAGES } from './constants';

/**
 * Grafana JSON Parser
 * Responsible for parsing and validating Grafana panel JSON
 */
export class GrafanaJsonParser {
  /**
   * Parse a Grafana panel JSON into our intermediate representation
   */
  static parsePanel(panelJson: GrafanaPanel): ParsedPanel {
    // Mock implementation - validate basic structure
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
  private static parseQueries(targets: any[]): ParsedQuery[] {
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
  private static mapPanelType(grafanaType: string): ParsedPanel['type'] {
    // Mock mapping - in real implementation this would be more sophisticated
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
   * Validate that a panel JSON has the minimum required fields
   */
  static validatePanel(panelJson: any): boolean {
    try {
      this.parsePanel(panelJson);
      return true;
    } catch {
      return false;
    }
  }
}