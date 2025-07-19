import { GrafanaRenderer, type RendererResult } from '@grafana-renderer/core';
import type { GrafanaActionParams, GrafanaActionResult } from './types';

/**
 * Svelte action for rendering Grafana panels
 * 
 * Usage:
 * <canvas use:grafanaAction={{ panelJson, options }} />
 */
export function grafanaAction(
  canvas: HTMLCanvasElement,
  params: GrafanaActionParams
): GrafanaActionResult {
  let rendererResult: RendererResult | null = null;

  // Initialize the renderer
  const init = async () => {
    try {
      console.log('Mock: Initializing Grafana action with params:', params);
      
      const renderer = new GrafanaRenderer(canvas, params.options);
      rendererResult = await renderer.render(params.panelJson);
      
      console.log('Mock: Grafana action initialized successfully');
    } catch (error) {
      console.error('Mock: Failed to initialize Grafana action:', error);
    }
  };

  // Initialize on mount
  init();

  return {
    update(newParams: GrafanaActionParams) {
      // Update the chart with new parameters
      if (rendererResult) {
        console.log('Mock: Updating Grafana action with new params:', newParams);
        
        // If the panel JSON changed, we need to re-render
        if (newParams.panelJson !== params.panelJson) {
          rendererResult.destroy();
          params = newParams;
          init();
        } else {
          // Just update the options
          params = newParams;
          rendererResult.update(newParams.options);
        }
      }
    },

    destroy() {
      if (rendererResult) {
        console.log('Mock: Destroying Grafana action');
        rendererResult.destroy();
        rendererResult = null;
      }
    }
  };
}