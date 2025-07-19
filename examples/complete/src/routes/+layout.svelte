<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { theme } from '$lib/stores';
  import '../app.css';

  onMount(() => {
    theme.init();
  });

  $: currentPath = $page.url.pathname;
</script>

<div class="header">
  <div class="container">
    <nav class="nav">
      <h1 style="margin: 0; margin-right: auto;">
        <a href="/" style="text-decoration: none; color: inherit;">
          libGraphit SvelteKit Example
        </a>
      </h1>
      
      <a href="/" class:active={currentPath === '/'}>Home</a>
      <a href="/basic" class:active={currentPath === '/basic'}>Basic Usage</a>
      <a href="/advanced" class:active={currentPath === '/advanced'}>Advanced</a>
      <a href="/multi-panel" class:active={currentPath === '/multi-panel'}>Multi-Panel</a>
      
      <button 
        class="theme-toggle" 
        on:click={theme.toggle}
        aria-label="Toggle theme"
      >
        {$theme === 'light' ? '🌙' : '☀️'}
      </button>
    </nav>
  </div>
</div>

<main class="container">
  <slot />
</main>

<style>
  .active {
    background-color: var(--primary-color) !important;
    color: white !important;
  }
</style>