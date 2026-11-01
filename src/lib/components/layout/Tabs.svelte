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
  const tabsId = $props.id();

  function select(id: string) {
    active = id;
    onchange?.(id);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;

    event.preventDefault();
    const current = event.currentTarget as HTMLButtonElement;
    const buttons = Array.from(current.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? []);
    const currentIndex = buttons.indexOf(current);
    let nextIndex = currentIndex;

    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = buttons.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % buttons.length;
    else nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;

    const next = buttons[nextIndex];
    if (!next) return;
    next.focus();
    select(next.dataset.tabId ?? '');
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
        id={`${tabsId}-tab-${tab.id}`}
        data-tab-id={tab.id}
        role="tab"
        aria-selected={active === tab.id}
        aria-controls={`${tabsId}-panel`}
        tabindex={active === tab.id ? 0 : -1}
        disabled={tab.disabled}
        onclick={() => select(tab.id)}
        onkeydown={handleKeydown}
        class={cn(
          'relative flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium',
          'whitespace-nowrap transition-colors duration-[150ms]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-inset',
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
    id={`${tabsId}-panel`}
    role="tabpanel"
    aria-labelledby={`${tabsId}-tab-${active}`}
    tabindex="0"
    class={cn('mt-4', panelClass)}
  >
    {#if children}{@render children(active)}{/if}
  </div>
</div>
