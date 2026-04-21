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
  }

  interface Props<T extends Record<string, unknown>> {
    columns: Column<T>[];
    rows: T[];
    class?: string;
    rowKey?: keyof T;
    onrowclick?: (row: T) => void;
  }

  let {
    columns,
    rows,
    class: className = '',
    rowKey,
    onrowclick,
  }: Props<Record<string, unknown>> = $props();

  function getCellValue(row: Record<string, unknown>, key: string): string {
    const val = row[key];
    if (val === null || val === undefined) return '—';
    return String(val);
  }
</script>

<div class={cn('w-full overflow-x-auto rounded-[var(--radius)] border border-[var(--border)]', className)}>
  <table class="w-full text-sm border-collapse">
    <thead>
      <tr class="border-b border-[var(--border)] bg-[var(--muted)]/50">
        {#each columns as col}
          <th
            class={cn(
              'px-4 py-2.5 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide',
              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
              col.width && `w-[${col.width}]`
            )}
          >{col.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i (rowKey ? row[rowKey as string] : i)}
        <tr
          class={cn(
            'border-b border-[var(--border)] last:border-0',
            'transition-colors duration-[100ms]',
            onrowclick ? 'cursor-pointer hover:bg-[var(--muted)]/50' : 'hover:bg-[var(--muted)]/30',
          )}
          onclick={() => onrowclick?.(row)}
        >
          {#each columns as col}
            <td
              class={cn(
                'px-4 py-3 text-[var(--foreground)]',
                col.mono && 'font-mono text-xs',
                col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                'max-w-[280px] truncate'
              )}
            >
              {getCellValue(row, col.key as string)}
            </td>
          {/each}
        </tr>
      {/each}

      {#if rows.length === 0}
        <tr>
          <td colspan={columns.length} class="px-4 py-10 text-center text-sm text-[var(--muted-foreground)]">
            No data
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>
