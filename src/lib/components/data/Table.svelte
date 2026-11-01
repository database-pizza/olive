<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Column<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    align?: 'left' | 'right' | 'center';
    mono?: boolean;
    render?: (row: T) => Snippet | string;
    hideOnMobile?: boolean;
  }

  interface Props<T extends Record<string, unknown>> {
    columns: Column<T>[];
    rows: T[];
    class?: string;
    rowKey?: keyof T;
    dense?: boolean;
    stickyHeader?: boolean;
    empty?: string;
    onrowclick?: (row: T) => void;
  }

  let {
    columns,
    rows,
    class: className = '',
    rowKey,
    dense = false,
    stickyHeader = false,
    empty = 'No data',
    onrowclick,
  }: Props<Record<string, unknown>> = $props();

  function getCellValue(row: Record<string, unknown>, key: string): string {
    const value = row[key];
    if (value === null || value === undefined) return '—';
    return String(value);
  }

  function handleRowKeydown(event: KeyboardEvent, row: Record<string, unknown>) {
    if (!onrowclick || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onrowclick(row);
  }
</script>

<div
  class={cn(
    'w-full overflow-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)]',
    'shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)]',
    className,
  )}
>
  <table class="w-full border-collapse text-[13px]">
    <thead>
      <tr class="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--muted)_45%,var(--card))]">
        {#each columns as col}
          <th
            scope="col"
            class={cn(
              'whitespace-nowrap px-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--subtle-foreground)]',
              dense ? 'py-1.5' : 'py-2',
              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
              col.hideOnMobile && 'hidden sm:table-cell',
              stickyHeader && 'sticky top-0 z-10 bg-[var(--card)]',
            )}
            style:width={col.width}
          >
            {col.label}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i (rowKey ? row[rowKey as string] : i)}
        <tr
          tabindex={onrowclick ? 0 : undefined}
          class={cn(
            'border-b border-[var(--border)] last:border-0',
            'transition-colors duration-[var(--duration-micro)]',
            onrowclick && 'cursor-pointer hover:bg-[var(--accent)] focus-visible:bg-[var(--accent)] focus-visible:outline-none',
            !onrowclick && 'hover:bg-[color-mix(in_oklab,var(--muted)_40%,transparent)]',
          )}
          onclick={() => onrowclick?.(row)}
          onkeydown={(event) => handleRowKeydown(event, row)}
        >
          {#each columns as col}
            <td
              class={cn(
                'max-w-[22rem] truncate px-3 text-[var(--foreground)]',
                dense ? 'py-1.5' : 'py-2.5',
                col.mono && 'font-mono text-[11px]',
                col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                col.hideOnMobile && 'hidden sm:table-cell',
              )}
            >
              {getCellValue(row, col.key as string)}
            </td>
          {/each}
        </tr>
      {/each}

      {#if rows.length === 0}
        <tr>
          <td
            colspan={columns.length}
            class="px-4 py-10 text-center text-[13px] text-[var(--muted-foreground)]"
          >
            {empty}
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>
