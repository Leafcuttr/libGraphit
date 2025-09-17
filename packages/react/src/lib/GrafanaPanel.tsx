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
  const rendererRef = useRef<GrafanaRenderer | null>(null);
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
        // keep renderer reference so we can destroy it even if render() is still pending
        rendererRef.current = renderer;

        const result = await renderer.render(panelJson);

        // If component was already unmounted while render() was in-flight,
        // destroy the created renderer immediately to avoid leaving a Chart.js
        // instance attached to the canvas.
        if (destroyed) {
          try {
            // prefer the public destroy on result, fallback to renderer.destroy
            result.destroy?.();
            renderer.destroy();
          } catch (e) {
            // swallow - we're already unmounting
          }
          rendererRef.current = null;
          return;
        }

        rendererResultRef.current = result;

        setLoading(false);
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
      // destroy renderer result if available
      if (rendererResultRef.current) {
        try {
          rendererResultRef.current.destroy();
        } catch (e) {
          // ignore
        }
        rendererResultRef.current = null;
      }

      // if a renderer was created but render() hadn't completed yet, make sure
      // to destroy it too (this will handle charts created after an unmount)
      if (rendererRef.current) {
        try {
          rendererRef.current.destroy();
        } catch (e) {
          // ignore
        }
        rendererRef.current = null;
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
