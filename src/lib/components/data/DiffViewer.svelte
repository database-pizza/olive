<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type RowKind = 'context' | 'add' | 'remove';

  interface Props {
    before: string;
    after: string;
    context?: number;
    maxLines?: number;
    class?: string;
    empty?: string;
  }

  let {
    before,
    after,
    context = 2,
    maxLines = 400,
    class: className = '',
    empty = 'No changes',
  }: Props = $props();

  let rows = $derived.by(() => {
    const a = before.split('\n');
    const b = after.split('\n');

    if (a.length > maxLines || b.length > maxLines) {
      return null;
    }

    // Classic LCS table, small inputs only.
    const n = a.length;
    const m = b.length;
    const table: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        table[i][j] = a[i] === b[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }

    const all: Array<{ kind: RowKind; text: string; oldLine?: number; newLine?: number }> = [];
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) {
        all.push({ kind: 'context', text: a[i], oldLine: i + 1, newLine: j + 1 });
        i++;
        j++;
      } else if (table[i + 1][j] >= table[i][j + 1]) {
        all.push({ kind: 'remove', text: a[i], oldLine: i + 1 });
        i++;
      } else {
        all.push({ kind: 'add', text: b[j], newLine: j + 1 });
        j++;
      }
    }
    while (i < n) all.push({ kind: 'remove', text: a[i], oldLine: ++i });
    while (j < m) all.push({ kind: 'add', text: b[j], newLine: ++j });

    // Collapse long runs of unchanged lines.
    const keep = new Set<number>();
    all.forEach((row, index) => {
      if (row.kind === 'context') return;
      for (let k = index - context; k <= index + context; k++) {
        if (k >= 0 && k < all.length) keep.add(k);
      }
    });
    if (all.every((row) => row.kind === 'context')) return [];

    const visible: Array<{ kind: RowKind | 'gap'; text: string; oldLine?: number; newLine?: number }> = [];
    let skipped = 0;
    all.forEach((row, index) => {
      if (keep.has(index)) {
        if (skipped > 0) {
          visible.push({ kind: 'gap', text: `${skipped} unchanged line${skipped === 1 ? '' : 's'}` });
          skipped = 0;
        }
        visible.push(row);
      } else {
        skipped++;
      }
    });
    return visible;
  });

  const rowClass: Record<RowKind | 'gap', string> = {
    context: 'text-[var(--muted-foreground)]',
    add: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    remove: 'bg-red-500/10 text-red-700 dark:text-red-300',
    gap: 'bg-[var(--muted)]/50 text-[var(--muted-foreground)]',
  };

  const marker: Record<RowKind | 'gap', string> = {
    context: ' ',
    add: '+',
    remove: '−',
    gap: '…',
  };
</script>

<div class={cn('overflow-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] font-mono text-[11px]', className)}>
  {#if rows === null}
    <p class="p-4 text-[var(--muted-foreground)]">Diff too large to render inline.</p>
  {:else if rows.length === 0}
    <p class="p-4 text-[var(--muted-foreground)]">{empty}</p>
  {:else}
    <table class="w-full border-collapse">
      <tbody>
        {#each rows as row}
          <tr class={rowClass[row.kind]}>
            <td class="w-10 select-none border-r border-[var(--border)]/60 px-2 py-0.5 text-right tabular-nums opacity-60">
              {row.oldLine ?? ''}
            </td>
            <td class="w-10 select-none border-r border-[var(--border)]/60 px-2 py-0.5 text-right tabular-nums opacity-60">
              {row.newLine ?? ''}
            </td>
            <td class="w-4 select-none px-1 py-0.5 text-center">{marker[row.kind]}</td>
            <td class="whitespace-pre-wrap break-all px-2 py-0.5">{row.text || ' '}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
