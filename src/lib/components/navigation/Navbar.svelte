<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import ThemeToggle from './ThemeToggle.svelte';

  interface Props {
    class?: string;
    logo?: Snippet;
    nav?: Snippet;
    actions?: Snippet;
    hideThemeToggle?: boolean;
  }

  let {
    class: className = '',
    logo,
    nav,
    actions,
    hideThemeToggle = false,
  }: Props = $props();

  let menuOpen = $state(false);
</script>

<header
  class={cn(
    'sticky top-0 z-40 h-14 w-full',
    'bg-[var(--card)]/80 backdrop-blur-xl',
    'border-b border-[var(--border)]',
    className
  )}
>
  <div class="mx-auto flex h-full w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
    <!-- Logo -->
    {#if logo}
      <div class="flex shrink-0 items-center">
        {@render logo()}
      </div>
    {/if}

    <!-- Desktop nav -->
    {#if nav}
      <nav class="hidden md:flex items-center gap-1 flex-1">
        {@render nav()}
      </nav>
    {:else}
      <div class="flex-1"></div>
    {/if}

    <!-- Actions + theme toggle -->
    <div class="flex items-center gap-1">
      {#if actions}
        {@render actions()}
      {/if}
      {#if !hideThemeToggle}
        <ThemeToggle />
      {/if}

      <!-- Mobile menu button -->
      {#if nav}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onclick={() => { menuOpen = !menuOpen; }}
          class={cn(
            'md:hidden flex h-8 w-8 items-center justify-center rounded-[var(--radius)]',
            'cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]',
            'transition-all duration-[150ms]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            {#if menuOpen}
              <path d="M18 6L6 18M6 6l12 12"/>
            {:else}
              <path d="M4 6h16M4 12h16M4 18h16"/>
            {/if}
          </svg>
        </button>
      {/if}
    </div>
  </div>

  <!-- Mobile nav dropdown -->
  {#if nav && menuOpen}
    <div
      class="md:hidden border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-xl"
    >
      <div class="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
        {@render nav()}
      </div>
    </div>
  {/if}
</header>
