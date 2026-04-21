<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { cn } from '$lib/utils/cn.js';
  import ThemeToggle from '$lib/components/navigation/ThemeToggle.svelte';
  import Toaster from '$lib/components/overlay/Toaster.svelte';

  interface Props { children?: Snippet; }
  let { children }: Props = $props();

  let mobileOpen = $state(false);

  const nav = [
    { label: 'Getting started', href: '/',           icon: 'start' },
    { section: 'Components' },
    { label: 'Primitives',      href: '/primitives', icon: 'prim' },
    { label: 'Layout',          href: '/layout',     icon: 'layout' },
    { label: 'Navigation',      href: '/navigation', icon: 'nav' },
    { label: 'Overlay',         href: '/overlay',    icon: 'overlay' },
    { label: 'Forms',           href: '/forms',      icon: 'forms' },
    { label: 'Data',            href: '/data',       icon: 'data' },
  ];

  const icons: Record<string, string> = {
    start:   'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    prim:    'M12 2H2v10h10V2zM22 2h-6v6h6V2zM22 14h-6v6h6v-6zM16 14H6v6h10v-6z',
    layout:  'M3 3h18v4H3zM3 10h8v11H3zM14 10h7v5h-7zM14 18h7v3h-7z',
    nav:     'M3 12h18M3 6h18M3 18h18',
    overlay: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    forms:   'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    data:    'M3 3h18v18H3zM3 9h18M3 15h18M9 3v18',
  };

  function isActive(href: string) {
    return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Toaster />

<div class="flex min-h-screen bg-[var(--background)]">
  <!-- Mobile overlay -->
  {#if mobileOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
      onclick={() => { mobileOpen = false; }}
    ></div>
  {/if}

  <!-- Sidebar -->
  <aside
    class={cn(
      'fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col',
      'border-r border-[var(--border)] bg-[var(--card)]',
      'transition-transform duration-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
      'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
      mobileOpen ? 'translate-x-0' : '-translate-x-full'
    )}
  >
    <!-- Logo -->
    <div class="flex h-14 shrink-0 items-center border-b border-[var(--border)] px-4">
      <a href="/" class="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
        <span class="text-base">🫒</span> olive
      </a>
    </div>

    <!-- Nav -->
    <nav class="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
      {#each nav as item}
        {#if 'section' in item}
          <p class="mb-1 mt-3 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]/60 first:mt-1">{item.section}</p>
        {:else if item.href}
          {@const active = isActive(item.href)}
          <a
            href={item.href}
            onclick={() => { mobileOpen = false; }}
            class={cn(
              'flex items-center gap-3 rounded-[var(--radius)] px-2.5 py-2 text-sm font-medium',
              'transition-colors duration-[100ms]',
              active
                ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="shrink-0">
              <path d={icons[item.icon]}/>
            </svg>
            {item.label}
          </a>
        {/if}
      {/each}
    </nav>

    <!-- Footer -->
    <div class="flex shrink-0 items-center justify-between border-t border-[var(--border)] px-3 py-2.5">
      <span class="text-xs text-[var(--muted-foreground)]">v0.1.0</span>
      <ThemeToggle />
    </div>
  </aside>

  <!-- Main -->
  <div class="flex min-w-0 flex-1 flex-col">
    <!-- Mobile topbar -->
    <div class="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--border)] bg-[var(--card)]/80 px-4 backdrop-blur-xl lg:hidden">
      <button
        type="button"
        onclick={() => { mobileOpen = !mobileOpen; }}
        aria-label="Toggle navigation"
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[var(--radius)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          {#if mobileOpen}
            <path d="M18 6L6 18M6 6l12 12"/>
          {:else}
            <path d="M4 6h16M4 12h16M4 18h16"/>
          {/if}
        </svg>
      </button>
      <span class="text-sm font-semibold text-[var(--foreground)]">🫒 olive</span>
    </div>

    <main class="flex-1">
      {#if children}{@render children()}{/if}
    </main>
  </div>
</div>
