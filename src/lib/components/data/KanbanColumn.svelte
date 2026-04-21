<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    id: string;
    title: string;
    count?: number;
    class?: string;
    children?: Snippet;
    ondrop?: (cardId: string, columnId: string) => void;
  }

  let {
    id,
    title,
    count,
    class: className = '',
    children,
    ondrop,
  }: Props = $props();

  let over = $state(false);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    over = true;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    over = false;
    const cardId = e.dataTransfer?.getData('text/plain');
    if (cardId) ondrop?.(cardId, id);
  }
</script>

<div
  ondragover={handleDragOver}
  ondragleave={() => { over = false; }}
  ondrop={handleDrop}
  class={cn(
    'flex w-72 shrink-0 flex-col rounded-[var(--radius)] border bg-[var(--muted)]/30 transition-colors duration-[150ms]',
    over ? 'border-[var(--primary)]/60 bg-[var(--primary)]/5' : 'border-[var(--border)]',
    className
  )}
>
  <!-- Column header -->
  <div class="flex items-center justify-between px-3.5 py-3 border-b border-[var(--border)]">
    <h3 class="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
    {#if count !== undefined}
      <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--muted)] px-1.5 text-xs font-medium text-[var(--muted-foreground)]">
        {count}
      </span>
    {/if}
  </div>

  <!-- Cards -->
  <div class="flex flex-1 flex-col gap-2 overflow-y-auto p-2.5 min-h-[120px]">
    {#if children}
      {@render children()}
    {/if}

    {#if over}
      <div class="rounded-[var(--radius)] border-2 border-dashed border-[var(--primary)]/40 h-14 transition-all duration-[150ms]"></div>
    {/if}
  </div>
</div>
