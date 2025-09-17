import React, { useEffect, useRef, useState } from 'react';
import type { RendererResult } from '@leafcuttr/libgraphit-core';
import { GrafanaRenderer } from '@leafcuttr/libgraphit-core';
import type { GrafanaPanelProps } from './types';
import './GrafanaPanel.css';

const GrafanaPanel: React.FC<GrafanaPanelProps> = ({
  panelJson,
  prometheusUrl,
  timeRange,
  theme = 'light',
  refreshInterval,
  width = '100%',
  height = '400px',
  queryHandler,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const rendererResultRef = useRef<RendererResult | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    let destroyed = false;

    const renderPanel = async () => {
      try {
        setLoading(true);
        setError('');

        if (!panelJson) {
          throw new Error('panelJson is required');
        }

        const options = {
          prometheusUrl,
          timeRange,
          theme,
          refreshInterval,
          queryHandler,
        };

        const renderer = new GrafanaRenderer(canvasRef.current!, options);
        rendererResultRef.current = await renderer.render(panelJson);

        if (!destroyed) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to render panel:', err);
        if (!destroyed) {
          setError(err instanceof Error ? err.message : 'Unknown error occurred');
          setLoading(false);
        }
      }
    };

    renderPanel();

    return () => {
      destroyed = true;
      if (rendererResultRef.current) {
        rendererResultRef.current.destroy();
        rendererResultRef.current = null;
      }
    };
  }, [panelJson, prometheusUrl, queryHandler]);

  useEffect(() => {
    if (rendererResultRef.current) {
      rendererResultRef.current.update({
        timeRange,
        theme,
        refreshInterval,
      });
    }
  }, [timeRange, theme, refreshInterval]);

  return (
    <div
      className={`grafana-panel ${className} ${theme === 'dark' ? 'darkTheme' : ''}`}
      style={{ width, height }}
    >
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading chart...</p>
        </div>
      )}
      {error && (
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
          <small>Check your panel JSON and Prometheus URL</small>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="chart-canvas"
        style={{ width: '100%', height: '100%' }}
      ></canvas>
    </div>
  );
};

export default GrafanaPanel;
