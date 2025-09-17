import React, { useMemo } from 'react';
import GrafanaPanel from './GrafanaPanel';
import type { GrafanaDashboardProps } from './types';
import './GrafanaDashboard.css';

const GrafanaDashboard: React.FC<GrafanaDashboardProps> = ({
  dashboardJson,
  prometheusUrl,
  timeRange,
  theme = 'light',
  refreshInterval,
  queryHandler,
  className = '',
}) => {
  const panels = useMemo(() => dashboardJson?.panels || [], [dashboardJson]);

  const dashboardTimeRange = useMemo(() => {
    if (timeRange) {
      return timeRange;
    }
    if (dashboardJson?.time) {
      const now = Date.now();
      const from = dashboardJson.time.from;
      const start =
        from === 'now-1h' ? now - 3600000 :
        from === 'now-6h' ? now - 21600000 :
        from === 'now-24h' ? now - 86400000 :
        from === 'now-7d' ? now - 604800000 :
        from === 'now-30d' ? now - 2592000000 :
        now - 3600000;
      return { start, end: now };
    }
    return undefined;
  }, [timeRange, dashboardJson?.time]);

  const gridWidth = useMemo(() => {
    if (panels.length === 0) return 24;
    return Math.max(...panels.map(p => (p.gridPos?.x || 0) + (p.gridPos?.w || 12)), 24);
  }, [panels]);

  const gridHeight = useMemo(() => {
    if (panels.length === 0) return 8;
    return Math.max(...panels.map(p => (p.gridPos?.y || 0) + (p.gridPos?.h || 8)), 8);
  }, [panels]);

  return (
    <div
      className={`grafana-dashboard ${className} ${theme === 'dark' ? 'dark' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
        gridTemplateRows: `repeat(${gridHeight}, 50px)`,
        gap: '8px',
        padding: '16px',
      }}
    >
      {panels.map(panel => (
        <div
          key={panel.id}
          className="dashboard-panel"
          style={{
            gridColumn: `${(panel.gridPos?.x || 0) + 1} / ${(panel.gridPos?.x || 0) + (panel.gridPos?.w || 12) + 1}`,
            gridRow: `${(panel.gridPos?.y || 0) + 1} / ${(panel.gridPos?.y || 0) + (panel.gridPos?.h || 8) + 1}`,
          }}
        >
          <GrafanaPanel
            panelJson={panel}
            prometheusUrl={prometheusUrl}
            timeRange={dashboardTimeRange}
            theme={theme}
            refreshInterval={refreshInterval}
            queryHandler={queryHandler}
            width="100%"
            height="100%"
          />
        </div>
      ))}
    </div>
  );
};

export default GrafanaDashboard;
