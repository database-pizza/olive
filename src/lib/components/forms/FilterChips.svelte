<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    chips: Array<{ id: string; label: string; count?: number }>;
    active?: string | null;
    allLabel?: string;
    showAll?: boolean;
    onselect?: (id: string | null) => void;
    class?: string;
  }

  let {
    chips,
    active = $bindable<string | null>(null),
    allLabel = 'All',
    showAll = true,
    onselect,
    class: className = '',
  }: Props = $props();

  function select(id: string | null) {
    active = id;
    onselect?.(id);
  }
</script>

<div class={cn('flex flex-wrap items-center gap-1.5', className)} role="group" aria-label="Filters">
  {#if showAll}
    <button
      type="button"
      onclick={() => select(null)}
      aria-pressed={active === null}
      class={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors',
        active === null
          ? 'border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary)]'
          : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]',
      )}
    >
      {allLabel}
    </button>
  {/if}

  {#each chips as chip}
    <button
      type="button"
      onclick={() => select(chip.id)}
      aria-pressed={active === chip.id}
      class={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors',
        active === chip.id
          ? 'border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary)]'
          : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]',
      )}
    >
      {chip.label}
      {#if chip.count !== undefined}
        <span class="tabular-nums opacity-60">{chip.count}</span>
      {/if}
    </button>
  {/each}
</div>
