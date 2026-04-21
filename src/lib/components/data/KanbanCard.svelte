<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    id: string;
    title: string;
    description?: string;
    tags?: string[];
    assignee?: string;
    draggable?: boolean;
    class?: string;
    children?: Snippet;
    ondragstart?: (id: string) => void;
  }

  let {
    id,
    title,
    description,
    tags = [],
    assignee,
    draggable = true,
    class: className = '',
    children,
    ondragstart,
  }: Props = $props();

  let dragging = $state(false);

  function handleDragStart(e: DragEvent) {
    dragging = true;
    e.dataTransfer?.setData('text/plain', id);
    ondragstart?.(id);
  }
</script>

<div
  {draggable}
  ondragstart={handleDragStart}
  ondragend={() => { dragging = false; }}
  class={cn(
    'group rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-3',
    'shadow-[var(--shadow-sm)] transition-all duration-[150ms]',
    draggable && 'cursor-grab active:cursor-grabbing',
    dragging && 'opacity-40 scale-[0.98]',
    'hover:shadow-[var(--shadow-md)] hover:border-[var(--primary)]/30',
    className
  )}
>
  <p class="text-sm font-medium text-[var(--foreground)] leading-snug">{title}</p>

  {#if description}
    <p class="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-2">{description}</p>
  {/if}

  {#if children}
    <div class="mt-2">
      {@render children()}
    </div>
  {/if}

  {#if tags.length > 0 || assignee}
    <div class="mt-2.5 flex items-center justify-between gap-2">
      <div class="flex flex-wrap gap-1">
        {#each tags as tag}
          <span class="rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)]">
            {tag}
          </span>
        {/each}
      </div>
      {#if assignee}
        <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/20 text-[10px] font-semibold text-[var(--primary)] uppercase">
          {assignee.charAt(0)}
        </span>
      {/if}
    </div>
  {/if}
</div>
