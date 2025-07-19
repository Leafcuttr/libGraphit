import type { GrafanaPanel, ParsedPanel } from './types';
/**
 * Grafana JSON Parser
 * Responsible for parsing and validating Grafana panel JSON
 */
export declare class GrafanaJsonParser {
    /**
     * Parse a Grafana panel JSON into our intermediate representation
     */
    static parsePanel(panelJson: GrafanaPanel): ParsedPanel;
    /**
     * Parse Grafana targets into our query format
     */
    private static parseQueries;
    /**
     * Map Grafana panel type to our supported types
     */
    private static mapPanelType;
    /**
     * Validate that a panel JSON has the minimum required fields
     */
    static validatePanel(panelJson: any): boolean;
}
//# sourceMappingURL=parser.d.ts.map