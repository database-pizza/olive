<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Tab {
    id: string;
    label: string;
    icon?: Snippet;
    disabled?: boolean;
    count?: number;
  }

  interface Props {
    tabs: Tab[];
    active?: string;
    variant?: 'underline' | 'pill';
    class?: string;
    listClass?: string;
    panelClass?: string;
    children?: Snippet<[string]>;
    onchange?: (id: string) => void;
  }

  let {
    tabs,
    active = $bindable(tabs[0]?.id ?? ''),
    variant = 'underline',
    class: className = '',
    listClass = '',
    panelClass = '',
    children,
    onchange,
  }: Props = $props();

  const tabsId = $props.id();

  let listEl = $state<HTMLElement | null>(null);
  let indicator = $state({ left: 0, width: 0 });

  function measure() {
    if (!listEl) return;
    const selected = listEl.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(active)}"]`);
    if (!selected) {
      indicator = { left: 0, width: 0 };
      return;
    }
    indicator = {
      left: selected.offsetLeft,
      width: selected.offsetWidth,
    };
  }

  $effect(() => {
    active;
    tabs;
    measure();
    if (!listEl) return;
    const observer = new ResizeObserver(measure);
    observer.observe(listEl);
    for (const tab of Array.from(listEl.children)) observer.observe(tab as Element);
    return () => observer.disconnect();
  });

  function select(id: string) {
    const tab = tabs.find((candidate) => candidate.id === id);
    if (!tab || tab.disabled) return;
    active = id;
    onchange?.(id);
    queueMicrotask(measure);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const buttons = Array.from(
      listEl?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [],
    );
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex = currentIndex;
    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = buttons.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      nextIndex = (currentIndex + 1) % buttons.length;
    else nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;

    const next = buttons[nextIndex];
    if (!next) return;
    next.focus();
    select(next.dataset.tabId ?? '');
  }
</script>

<div class={cn('flex flex-col', className)}>
  <div
    bind:this={listEl}
    role="tablist"
    tabindex="-1"
    aria-orientation="horizontal"
    onkeydown={handleKeydown}
    class={cn(
      'relative flex items-center overflow-x-auto',
      variant === 'underline'
        ? 'gap-0.5 border-b border-[var(--border)]'
        : 'gap-0.5 rounded-[var(--radius-button)] bg-[var(--muted)] p-0.5',
      'olive-no-scrollbar',
      listClass,
    )}
  >
    {#if indicator.width > 0}
      <span
        aria-hidden="true"
        class={cn(
          'pointer-events-none absolute transition-[transform,width] duration-[var(--duration-base)] ease-[var(--ease-spring)]',
          variant === 'underline'
            ? 'bottom-[-1px] h-[2px] rounded-full bg-[var(--foreground)]'
            : 'top-0.5 bottom-0.5 rounded-[calc(var(--radius-button)-2px)] bg-[var(--card)] shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)]',
        )}
        style:transform="translateX({indicator.left}px)"
        style:width="{indicator.width}px"
      ></span>
    {/if}

    {#each tabs as tab (tab.id)}
      <button
        id={`${tabsId}-tab-${tab.id}`}
        data-tab-id={tab.id}
        role="tab"
        type="button"
        aria-selected={active === tab.id}
        aria-controls={`${tabsId}-panel`}
        tabindex={active === tab.id ? 0 : -1}
        disabled={tab.disabled}
        onclick={() => select(tab.id)}
        class={cn(
          'relative z-10 flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-sm)] px-1.5 max-[380px]:px-1',
          'text-[12.5px] font-medium outline-none transition-colors duration-[var(--duration-fast)] sm:px-3 sm:text-[13px]',
          'focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
          'focus-visible:ring-offset-[var(--background)]',
          'disabled:cursor-not-allowed disabled:opacity-40',
          active === tab.id
            ? 'text-[var(--foreground)]'
            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
        )}
      >
        {#if tab.icon}
          <span class="[&_svg]:size-3.5">{@render tab.icon()}</span>
        {/if}
        {tab.label}
        {#if tab.count !== undefined}
          <span
            class={cn(
              'olive-tnum rounded-full px-1.5 py-px text-[10px] font-semibold',
              active === tab.id
                ? 'bg-[var(--brand-soft)] text-[var(--brand-strong)] dark:text-[var(--brand)]'
                : 'bg-[var(--muted)] text-[var(--muted-foreground)]',
            )}
          >
            {tab.count}
          </span>
        {/if}
      </button>
    {/each}
  </div>

  <div
    id={`${tabsId}-panel`}
    role="tabpanel"
    aria-labelledby={`${tabsId}-tab-${active}`}
    tabindex="0"
    class={cn('outline-none', variant === 'underline' ? 'mt-4' : 'mt-3', panelClass)}
  >
    {#if children}{@render children(active)}{/if}
  </div>
</div>
