<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import { modal } from '$lib/utils/modal.js';
  import { surfaceIn, surfaceOut } from '$lib/utils/transitions.js';
  import { fade } from 'svelte/transition';

  interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    group?: string;
    shortcut?: string;
    onselect: () => void;
  }

  interface Props {
    items: CommandItem[];
    placeholder?: string;
    open?: boolean;
    shortcut?: boolean;
    onclose?: () => void;
  }

  let {
    items,
    placeholder = 'Search…',
    open = $bindable(false),
    shortcut = true,
    onclose,
  }: Props = $props();

  let query = $state('');
  let activeIndex = $state(0);
  let listEl = $state<HTMLElement | null>(null);
  const paletteId = $props.id();
  const listboxId = `${paletteId}-listbox`;

  function close() {
    open = false;
    query = '';
    activeIndex = 0;
    onclose?.();
  }

  const filtered = $derived.by(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.group?.toLowerCase().includes(q),
    );
  });

  const groups = $derived.by(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const group = item.group ?? '';
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(item);
    }
    return map;
  });

  $effect(() => {
    query;
    activeIndex = 0;
  });

  $effect(() => {
    if (!open) return;
    const container = listEl?.querySelector<HTMLElement>(`#${CSS.escape(`${paletteId}-option-${activeIndex}`)}`);
    container?.scrollIntoView({ block: 'nearest' });
  });

  $effect(() => {
    if (!shortcut || typeof window === 'undefined') return;
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (open) close();
        else open = true;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (item) {
        item.onselect();
        close();
      }
    }
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }

  function handleBackdrop(event: MouseEvent) {
    if (event.target === event.currentTarget) close();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    use:portal
    role="presentation"
    class="fixed inset-0 z-[120] flex items-start justify-center px-3 pt-[8vh] sm:p-4 sm:pt-[12vh]"
    onclick={handleBackdrop}
  >
    <div
      class="absolute inset-0 bg-[oklch(0.15_0.01_100/0.42)] backdrop-blur-[3px]"
      transition:fade={{ duration: 170 }}
    ></div>

    <div
      use:modal={{ onEscape: close, initialFocus: 'input' }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      tabindex="-1"
      in:surfaceIn
      out:surfaceOut
      class={cn(
        'relative z-10 flex max-h-[min(560px,calc(100dvh-2rem))] w-full max-w-lg flex-col overflow-hidden',
        'rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--popover)]',
        'shadow-[var(--olive-shadow-lg)]',
      )}
    >
      <div class="flex shrink-0 items-center gap-2.5 border-b border-[var(--border)] px-3.5">
        <svg
          class="size-4 shrink-0 text-[var(--muted-foreground)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          bind:value={query}
          {placeholder}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={filtered.length > 0 ? `${paletteId}-option-${activeIndex}` : undefined}
          aria-label="Search commands"
          onkeydown={handleKeydown}
          class="h-12 min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--subtle-foreground)]"
        />
        <kbd class="hidden shrink-0 rounded-[5px] border border-[var(--border)] bg-[var(--muted)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)] sm:block">
          Esc
        </kbd>
      </div>

      <div
        id={listboxId}
        bind:this={listEl}
        class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5"
        role="listbox"
        aria-label="Commands"
      >
        {#if filtered.length === 0}
          <div class="flex flex-col items-center gap-1 px-4 py-12 text-center">
            <p class="text-[13px] font-medium text-[var(--foreground)]">No results</p>
            <p class="text-xs text-[var(--muted-foreground)]">Nothing matches “{query}”.</p>
          </div>
        {:else}
          {#each groups as [group, groupItems]}
            {#if group}
              <p class="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--subtle-foreground)]">
                {group}
              </p>
            {/if}
            {#each groupItems as item}
              {@const idx = filtered.indexOf(item)}
              <button
                id={`${paletteId}-option-${idx}`}
                type="button"
                role="option"
                aria-selected={idx === activeIndex}
                tabindex="-1"
                onclick={() => {
                  item.onselect();
                  close();
                }}
                onmouseenter={() => {
                  activeIndex = idx;
                }}
                class={cn(
                  'flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-2 text-left text-[13px] outline-none transition-colors',
                  idx === activeIndex
                    ? 'bg-[var(--accent)] text-[var(--foreground)]'
                    : 'text-[var(--foreground)] hover:bg-[var(--accent)]',
                )}
              >
                {#if item.icon}
                  <span class="text-sm leading-none" aria-hidden="true">{item.icon}</span>
                {:else}
                  <span class="flex size-4 items-center justify-center text-[var(--muted-foreground)]" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                {/if}
                <span class="min-w-0 flex-1">
                  <span class="block truncate font-medium">{item.label}</span>
                  {#if item.description}
                    <span class="block truncate text-[11px] text-[var(--muted-foreground)]">{item.description}</span>
                  {/if}
                </span>
                {#if item.shortcut}
                  <kbd class="shrink-0 font-mono text-[10px] text-[var(--subtle-foreground)]">{item.shortcut}</kbd>
                {/if}
              </button>
            {/each}
          {/each}
        {/if}
      </div>

      <div class="hidden shrink-0 items-center gap-3 border-t border-[var(--border)] px-3.5 py-2 text-[10px] text-[var(--subtle-foreground)] sm:flex">
        <span class="flex items-center gap-1"><kbd class="font-mono">↑↓</kbd> navigate</span>
        <span class="flex items-center gap-1"><kbd class="font-mono">↵</kbd> open</span>
        <span class="flex items-center gap-1"><kbd class="font-mono">esc</kbd> close</span>
      </div>
    </div>
  </div>
{/if}
