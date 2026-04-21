<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    collapsed?: boolean;
    mobileOpen?: boolean;
    inline?: boolean;
    header?: Snippet<[{ collapsed: boolean }]>;
    footer?: Snippet<[{ collapsed: boolean }]>;
    children?: Snippet<[{ collapsed: boolean }]>;
    class?: string;
    oncollapsechange?: (collapsed: boolean) => void;
  }

  let {
    collapsed = $bindable(false),
    mobileOpen = $bindable(false),
    inline = false,
    header,
    footer,
    children,
    class: className = '',
    oncollapsechange,
  }: Props = $props();

  function toggleCollapse() {
    collapsed = !collapsed;
    oncollapsechange?.(collapsed);
  }
</script>

<!-- Mobile overlay -->
{#if mobileOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-[fadeIn_150ms_ease-out]"
    onclick={() => { mobileOpen = false; }}
  ></div>
{/if}

<!-- Sidebar panel -->
<aside
  class={cn(
    'flex flex-col',
    'border-r border-[var(--border)] bg-[var(--card)]',
    'transition-[width,transform] duration-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
    collapsed ? 'w-[56px]' : 'w-[220px]',
    inline
      ? 'sticky top-0 h-screen shrink-0'
      : [
          'fixed inset-y-0 left-0 z-50',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ],
    className
  )}
  aria-label="Sidebar navigation"
>
  <!-- Header slot -->
  {#if header}
    <div class="flex shrink-0 items-center border-b border-[var(--border)] px-2 h-14">
      {@render header({ collapsed })}
    </div>
  {/if}

  <!-- Nav content -->
  <div class="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-2">
    {#if children}
      {@render children({ collapsed })}
    {/if}
  </div>

  <!-- Footer slot -->
  {#if footer}
    <div class="flex shrink-0 flex-col gap-1 border-t border-[var(--border)] p-2">
      {@render footer({ collapsed })}
    </div>
  {/if}

  <!-- Collapse toggle (desktop, fixed mode only) -->
  <button
    type="button"
    onclick={toggleCollapse}
    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    class={cn(
      'absolute -right-3 top-[72px]',
      inline ? 'hidden' : 'hidden lg:flex',
      'h-6 w-6 cursor-pointer items-center justify-center',
      'rounded-full border border-[var(--border)] bg-[var(--card)]',
      'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
      'shadow-[var(--shadow-sm)] transition-colors duration-[150ms]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]'
    )}
  >
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      class={cn('transition-transform duration-[200ms]', collapsed && 'rotate-180')}
    >
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  </button>
</aside>

<style>
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
</style>
