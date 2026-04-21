<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import { browser } from '$app/environment';

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
    onclose?: () => void;
  }

  let {
    items,
    placeholder = 'Search…',
    open = $bindable(false),
    onclose,
  }: Props = $props();

  let query = $state('');
  let activeIndex = $state(0);
  let inputEl = $state<HTMLInputElement | null>(null);

  function close() {
    open = false;
    query = '';
    activeIndex = 0;
    onclose?.();
  }

  let filtered = $derived.by(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      i => i.label.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)
    );
  });

  let groups = $derived.by(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const g = item.group ?? '';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    }
    return map;
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
    } else if (e.key === 'Enter') {
      filtered[activeIndex]?.onselect();
      close();
    }
  }

  $effect(() => {
    if (!browser) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open = !open;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  });

  $effect(() => {
    if (open) setTimeout(() => inputEl?.focus(), 10);
  });

  // Track global index across groups for keyboard nav
  let flatIndex = $state(0);
  $effect(() => { flatIndex; activeIndex = 0; });
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4"
    onclick={(e) => { if (e.target === e.currentTarget) close(); }}
  >
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"></div>

    <div
      class={cn(
        'relative z-10 w-full max-w-lg overflow-hidden',
        'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
        'shadow-[var(--shadow-lg)]',
        'animate-[slideUpFadeIn_200ms_cubic-bezier(0.16,1,0.3,1)]'
      )}
      onkeydown={handleKeydown}
    >
      <!-- Search input -->
      <div class="flex items-center gap-3 border-b border-[var(--border)] px-4">
        <svg class="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          bind:this={inputEl}
          bind:value={query}
          {placeholder}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          class="flex-1 bg-transparent py-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
        />
        <kbd class="hidden sm:flex items-center gap-1 rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 py-0.5 text-xs text-[var(--muted-foreground)]">Esc</kbd>
      </div>

      <!-- Results -->
      <div class="max-h-[340px] overflow-y-auto py-2" role="listbox">
        {#if filtered.length === 0}
          <p class="px-4 py-10 text-center text-sm text-[var(--muted-foreground)]">No results for "{query}"</p>
        {:else}
          {#each groups as [group, groupItems]}
            {#if group}
              <p class="px-4 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">{group}</p>
            {/if}
            {#each groupItems as item, i}
              {@const idx = filtered.indexOf(item)}
              <button
                role="option"
                aria-selected={idx === activeIndex}
                onclick={() => { item.onselect(); close(); }}
                onmouseenter={() => { activeIndex = idx; }}
                class={cn(
                  'flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-[100ms]',
                  idx === activeIndex
                    ? 'bg-[var(--muted)] text-[var(--foreground)]'
                    : 'text-[var(--foreground)] hover:bg-[var(--muted)]/60'
                )}
              >
                {#if item.icon}
                  <span class="text-base leading-none">{item.icon}</span>
                {/if}
                <div class="flex-1 min-w-0 text-left">
                  <span class="block truncate font-medium">{item.label}</span>
                  {#if item.description}
                    <span class="block truncate text-xs text-[var(--muted-foreground)]">{item.description}</span>
                  {/if}
                </div>
                {#if item.shortcut}
                  <kbd class="shrink-0 rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 py-0.5 text-xs text-[var(--muted-foreground)]">{item.shortcut}</kbd>
                {/if}
              </button>
            {/each}
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes slideUpFadeIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
</style>
