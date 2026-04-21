<script lang="ts" generics="T extends Record<string, unknown>">
  import { cn } from '$lib/utils/cn.js';

  type SortDir = 'asc' | 'desc' | null;

  interface Column<T> {
    key: keyof T;
    header: string;
    sortable?: boolean;
    width?: string;
    render?: (value: T[keyof T], row: T) => string;
  }

  interface Props {
    data: T[];
    columns: Column<T>[];
    pageSize?: number;
    searchable?: boolean;
    searchPlaceholder?: string;
    empty?: string;
    class?: string;
  }

  let {
    data,
    columns,
    pageSize = 10,
    searchable = false,
    searchPlaceholder = 'Search…',
    empty = 'No results',
    class: className = '',
  }: Props = $props();

  let query = $state('');
  let sortKey = $state<keyof T | null>(null);
  let sortDir = $state<SortDir>(null);
  let page = $state(0);

  let filtered = $derived.by(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter(row =>
      columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(q))
    );
  });

  let sorted = $derived.by(() => {
    const key = sortKey;
    const dir = sortDir;
    if (!key || !dir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[key] as string | number;
      const bv = b[key] as string | number;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  let totalPages = $derived(Math.max(1, Math.ceil(sorted.length / pageSize)));
  let paged = $derived(sorted.slice(page * pageSize, (page + 1) * pageSize));

  $effect(() => { query; page = 0; });
  $effect(() => { sortKey; sortDir; page = 0; });

  function toggleSort(key: keyof T) {
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc';
      if (sortDir === null) sortKey = null;
    } else {
      sortKey = key;
      sortDir = 'asc';
    }
  }

  function cellValue(row: T, col: Column<T>): string {
    const v = row[col.key];
    return col.render ? col.render(v, row) : String(v ?? '');
  }
</script>

<div class={cn('flex flex-col gap-3', className)}>
  {#if searchable}
    <div class="relative flex items-center">
      <svg class="pointer-events-none absolute left-3 h-4 w-4 text-[var(--muted-foreground)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="text"
        bind:value={query}
        placeholder={searchPlaceholder}
        class={cn(
          'flex h-9 w-full rounded-[var(--radius)] border border-[var(--border)] bg-transparent',
          'pl-9 pr-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
          'transition-colors duration-[150ms]'
        )}
      />
    </div>
  {/if}

  <div class="overflow-x-auto rounded-[var(--radius)] border border-[var(--border)]">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-[var(--border)] bg-[var(--muted)]/40">
          {#each columns as col}
            <th
              class={cn(
                'px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]',
                col.sortable && 'cursor-pointer select-none hover:text-[var(--foreground)] transition-colors'
              )}
              style={col.width ? `width: ${col.width}` : ''}
              onclick={() => col.sortable && toggleSort(col.key)}
            >
              <span class="inline-flex items-center gap-1.5">
                {col.header}
                {#if col.sortable}
                  <span class="flex flex-col gap-px">
                    <svg width="8" height="5" viewBox="0 0 8 5" class={cn('transition-colors', sortKey === col.key && sortDir === 'asc' ? 'text-[var(--foreground)]' : 'text-[var(--border)]')}>
                      <path d="M0 5L4 0L8 5H0Z" fill="currentColor"/>
                    </svg>
                    <svg width="8" height="5" viewBox="0 0 8 5" class={cn('transition-colors', sortKey === col.key && sortDir === 'desc' ? 'text-[var(--foreground)]' : 'text-[var(--border)]')}>
                      <path d="M0 0L4 5L8 0H0Z" fill="currentColor"/>
                    </svg>
                  </span>
                {/if}
              </span>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if paged.length === 0}
          <tr>
            <td colspan={columns.length} class="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">{empty}</td>
          </tr>
        {:else}
          {#each paged as row, i}
            <tr class={cn('border-b border-[var(--border)] last:border-0 transition-colors duration-[100ms] hover:bg-[var(--muted)]/30', i % 2 === 1 && 'bg-[var(--muted)]/10')}>
              {#each columns as col}
                <td class="px-4 py-3 text-[var(--foreground)]">{@html cellValue(row, col)}</td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  {#if totalPages > 1}
    <div class="flex items-center justify-between text-sm text-[var(--muted-foreground)]">
      <span>{sorted.length} result{sorted.length !== 1 ? 's' : ''}</span>
      <div class="flex items-center gap-1">
        <button
          type="button"
          onclick={() => page = Math.max(0, page - 1)}
          disabled={page === 0}
          class={cn(
            'flex h-7 w-7 cursor-pointer items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] transition-colors',
            page === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--muted)]'
          )}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {#each Array.from({ length: totalPages }, (_, i) => i) as p}
          {#if totalPages <= 7 || p === 0 || p === totalPages - 1 || Math.abs(p - page) <= 1}
            <button
              type="button"
              onclick={() => page = p}
              class={cn(
                'flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-[var(--radius-button)] border px-1.5 text-xs transition-colors',
                p === page
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] font-medium'
                  : 'border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)]'
              )}
            >{p + 1}</button>
          {:else if Math.abs(p - page) === 2}
            <span class="px-0.5">…</span>
          {/if}
        {/each}

        <button
          type="button"
          onclick={() => page = Math.min(totalPages - 1, page + 1)}
          disabled={page === totalPages - 1}
          class={cn(
            'flex h-7 w-7 cursor-pointer items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] transition-colors',
            page === totalPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--muted)]'
          )}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  {/if}
</div>
