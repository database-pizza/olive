<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { setContext } from 'svelte';

  interface Tab {
    id: string;
    label: string;
    icon?: Snippet;
    disabled?: boolean;
  }

  interface Props {
    tabs: Tab[];
    active?: string;
    class?: string;
    panelClass?: string;
    children?: Snippet<[string]>;
    onchange?: (id: string) => void;
  }

  let {
    tabs,
    active = $bindable(tabs[0]?.id ?? ''),
    class: className = '',
    panelClass = '',
    children,
    onchange,
  }: Props = $props();

  function select(id: string) {
    active = id;
    onchange?.(id);
  }

  setContext('tabs', { get active() { return active; } });
</script>

<div class={cn('flex flex-col gap-0', className)}>
  <!-- Tab list -->
  <div
    role="tablist"
    class="flex items-center gap-0.5 border-b border-[var(--border)] overflow-x-auto"
  >
    {#each tabs as tab}
      <button
        role="tab"
        aria-selected={active === tab.id}
        aria-controls="tabpanel-{tab.id}"
        disabled={tab.disabled}
        onclick={() => select(tab.id)}
        class={cn(
          'relative flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium',
          'whitespace-nowrap transition-colors duration-[150ms]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset',
          'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
          active === tab.id
            ? 'text-[var(--foreground)]'
            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
        )}
      >
        {#if tab.icon}{@render tab.icon()}{/if}
        {tab.label}
        <!-- Active indicator -->
        {#if active === tab.id}
          <span
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-t-[2px]"
          ></span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Panel -->
  <div
    id="tabpanel-{active}"
    role="tabpanel"
    class={cn('mt-4', panelClass)}
  >
    {#if children}{@render children(active)}{/if}
  </div>
</div>
