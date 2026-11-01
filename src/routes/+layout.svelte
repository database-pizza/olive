<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { cn } from '$lib/utils/cn.js';
  import {
    AppShell,
    Sidebar,
    SidebarItem,
    SidebarSection,
    ThemeToggle,
    Toaster,
    Badge,
  } from '$lib/index.js';

  interface Props { children?: Snippet; }
  let { children }: Props = $props();

  let mobileOpen = $state(false);
  let collapsed = $state(false);

  const nav = [
    { label: 'Foundations', href: '/', icon: 'start', section: 'Overview' },
    { label: 'Primitives', href: '/primitives', icon: 'prim', section: 'Components' },
    { label: 'Layout', href: '/layout', icon: 'layout' },
    { label: 'Navigation', href: '/navigation', icon: 'nav' },
    { label: 'Overlay', href: '/overlay', icon: 'overlay' },
    { label: 'Forms', href: '/forms', icon: 'forms' },
    { label: 'Data', href: '/data', icon: 'data' },
  ];

  const icons: Record<string, string> = {
    start: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    prim: 'M12 2H2v10h10V2zM22 2h-6v6h6V2zM22 14h-6v6h6v-6zM16 14H6v6h10v-6z',
    layout: 'M3 3h18v4H3zM3 10h8v11H3zM14 10h7v5h-7zM14 18h7v3h-7z',
    nav: 'M3 12h18M3 6h18M3 18h18',
    overlay: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    forms: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    data: 'M3 3h18v18H3zM3 9h18M3 15h18M9 3v18',
  };

  function isActive(href: string) {
    return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
  }

  const title = $derived(nav.find((item) => isActive(item.href))?.label ?? 'Olive');
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Toaster />

<AppShell>
  {#snippet sidebar()}
    <Sidebar bind:collapsed bind:mobileOpen mobileTitle="Olive">
      {#snippet header({ collapsed: c })}
        <a href="/" class="flex min-w-0 items-center gap-2.5 rounded-[var(--radius-sm)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-base" aria-hidden="true">🫒</span>
          {#if !c}
            <span class="truncate text-[13px] font-semibold tracking-[-0.01em]">olive</span>
            <span class="ml-auto rounded-full border border-[var(--border)] px-1.5 py-px text-[9px] font-medium text-[var(--subtle-foreground)]">0.1</span>
          {/if}
        </a>
      {/snippet}

      {#snippet children({ collapsed: c })}
        {#each nav as item}
          {#if item.section}
            <SidebarSection label={item.section} collapsed={c} class="mt-1">
              <SidebarItem href={item.href} label={item.label} collapsed={c} active={isActive(item.href)} onclick={() => (mobileOpen = false)}>
                {#snippet icon()}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d={icons[item.icon]} />
                  </svg>
                {/snippet}
              </SidebarItem>
            </SidebarSection>
          {:else}
            <SidebarItem href={item.href} label={item.label} collapsed={c} active={isActive(item.href)} onclick={() => (mobileOpen = false)}>
              {#snippet icon()}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d={icons[item.icon]} />
                </svg>
              {/snippet}
            </SidebarItem>
          {/if}
        {/each}
      {/snippet}

      {#snippet footer({ collapsed: c })}
        <div class="flex items-center gap-2 px-1 py-1" class:justify-center={c}>
          {#if !c}
            <span class="flex-1 truncate text-[10px] text-[var(--subtle-foreground)]">
              Svelte 5 · Tailwind 4
            </span>
          {/if}
          <ThemeToggle />
        </div>
      {/snippet}
    </Sidebar>
  {/snippet}

  {#snippet header()}
    <div class="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--border)] px-4 sm:px-6">
      <button
        type="button"
        onclick={() => (mobileOpen = true)}
        class="flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)] lg:hidden"
        aria-label="Open navigation"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      <span class="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--subtle-foreground)]">Olive</span>
      <span class="text-[var(--border-strong)]">/</span>
      <span class="text-[13px] font-medium text-[var(--foreground)]">{title}</span>
      <div class="ml-auto flex items-center gap-1.5">
        <Badge variant="outline" class="hidden sm:inline-flex">Design system</Badge>
      </div>
    </div>
  {/snippet}

  <div class={cn('min-h-full')}>
    {#if children}{@render children()}{/if}
  </div>
</AppShell>
