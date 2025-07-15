import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Theme store
function createThemeStore() {
  const { subscribe, set, update } = writable<'light' | 'dark'>('light');

  return {
    subscribe,
    toggle: () => update(theme => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      if (browser) {
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
      return newTheme;
    }),
    init: () => {
      if (browser) {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
        set(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
    }
  };
}

export const theme = createThemeStore();

// Prometheus URL store
export const prometheusUrl = writable('/mock-prometheus');

// Time range store
export const timeRange = writable({
  from: 'now-1h',
  to: 'now'
});

// Refresh interval store (in seconds)
export const refreshInterval = writable(30);