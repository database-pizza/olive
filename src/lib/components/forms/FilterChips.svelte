<script lang="ts">
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

  const chipClass = (selected: boolean) =>
    cn(
      'inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium outline-none',
      'transition-[background-color,border-color,color,transform] duration-[var(--duration-fast)]',
      'active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
      selected
        ? 'border-[color-mix(in_oklab,var(--brand)_35%,transparent)] bg-[var(--brand-soft)] text-[var(--brand-strong)] dark:text-[var(--brand)]'
        : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]',
    );
</script>

<div class={cn('flex flex-wrap items-center gap-1.5', className)} role="group" aria-label="Filters">
  {#if showAll}
    <button type="button" onclick={() => select(null)} aria-pressed={active === null} class={chipClass(active === null)}>
      {allLabel}
    </button>
  {/if}

  {#each chips as chip}
    <button
      type="button"
      onclick={() => select(chip.id)}
      aria-pressed={active === chip.id}
      class={chipClass(active === chip.id)}
    >
      {chip.label}
      {#if chip.count !== undefined}
        <span class={cn('olive-tnum rounded-full px-1 text-[10px]', active === chip.id ? 'bg-[var(--brand)]/16' : 'bg-[var(--muted)]')}>
          {chip.count}
        </span>
      {/if}
    </button>
  {/each}
</div>
