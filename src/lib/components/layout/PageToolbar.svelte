<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    title?: string;
    description?: string;
    sticky?: boolean;
    left?: Snippet;
    right?: Snippet;
    class?: string;
  }

  let {
    title,
    description,
    sticky = true,
    left,
    right,
    class: className = '',
  }: Props = $props();
</script>

<div
  class={cn(
    'z-20 -mx-1 flex flex-col gap-2 border-b border-[var(--border)] bg-[var(--background)]/85 px-1 py-2 backdrop-blur',
    sticky && 'sticky top-0',
    className,
  )}
>
  <div class="flex flex-wrap items-center justify-between gap-2">
    <div class="flex min-w-0 flex-wrap items-center gap-2">
      {#if title}
        <h2 class="truncate text-sm font-semibold text-[var(--foreground)]">{title}</h2>
      {/if}
      {#if description}
        <span class="text-xs text-[var(--muted-foreground)]">{description}</span>
      {/if}
      {#if left}{@render left()}{/if}
    </div>
    {#if right}
      <div class="flex flex-wrap items-center gap-2">{@render right()}</div>
    {/if}
  </div>
</div>
