<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { modal } from '$lib/utils/modal.js';

  interface Props {
    collapsed?: boolean;
    mobileOpen?: boolean;
    header?: Snippet<[{ collapsed: boolean }]>;
    footer?: Snippet<[{ collapsed: boolean }]>;
    children?: Snippet<[{ collapsed: boolean }]>;
    class?: string;
    mobileTitle?: string;
    oncollapsechange?: (collapsed: boolean) => void;
  }

  let {
    collapsed = $bindable(false),
    mobileOpen = $bindable(false),
    header,
    footer,
    children,
    class: className = '',
    mobileTitle = 'Navigation',
    oncollapsechange,
  }: Props = $props();

  function toggleCollapse() {
    collapsed = !collapsed;
    oncollapsechange?.(collapsed);
  }

  $effect(() => {
    if (!mobileOpen) return;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') mobileOpen = false;
    };
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  });
</script>

<!-- Desktop -->
<aside
  class={cn(
    'hidden shrink-0 flex-col bg-[var(--sidebar)] lg:flex',
    'transition-[width] duration-[var(--duration-base)] ease-[var(--ease-enter)]',
    collapsed ? 'w-[60px]' : 'w-[236px]',
    className,
  )}
  aria-label="Sidebar navigation"
  data-collapsed={collapsed || undefined}
>
  {#if header}
    <div class="flex h-14 shrink-0 items-center gap-2 px-3">
      {@render header({ collapsed })}
    </div>
  {/if}

  <div class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-2 py-1 olive-no-scrollbar">
    {#if children}{@render children({ collapsed })}{/if}
  </div>

  {#if footer}
    <div class="flex shrink-0 flex-col gap-1 px-2 pb-3 pt-1">
      {@render footer({ collapsed })}
    </div>
  {/if}
</aside>

<!-- Mobile drawer -->
{#if mobileOpen}
  <div class="fixed inset-0 z-[90] lg:hidden">
    <button
      type="button"
      tabindex="-1"
      aria-label="Close navigation"
      class="absolute inset-0 bg-[oklch(0.15_0.01_100/0.45)] backdrop-blur-[2px] animate-[olive-fade-in_180ms_var(--ease-enter)]"
      onclick={() => {
        mobileOpen = false;
      }}
    ></button>

    <div
      use:modal={{ onEscape: () => (mobileOpen = false) }}
      role="dialog"
      aria-modal="true"
      aria-label={mobileTitle}
      tabindex="-1"
      class={cn(
        'absolute inset-y-0 left-0 flex w-[min(84vw,316px)] flex-col',
        'bg-[var(--sidebar)] shadow-[var(--olive-shadow-lg)]',
        'rounded-r-[var(--radius-2xl)] border-r border-[var(--border)]',
        'animate-[olive-sheet-in-left_280ms_var(--ease-enter)]',
      )}
    >
      <div class="flex h-14 shrink-0 items-center gap-2 pl-4 pr-2 olive-safe-top">
        {#if header}
          {@render header({ collapsed: false })}
        {/if}
        <button
          type="button"
          onclick={() => {
            mobileOpen = false;
          }}
          aria-label="Close navigation"
          class="ml-auto flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--sidebar-accent)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2.5 py-2">
        {#if children}{@render children({ collapsed: false })}{/if}
      </div>

      {#if footer}
        <div class="flex shrink-0 flex-col gap-1 border-t border-[var(--sidebar-border)] px-2.5 py-2 olive-safe-bottom">
          {@render footer({ collapsed: false })}
        </div>
      {/if}
    </div>
  </div>
{/if}
