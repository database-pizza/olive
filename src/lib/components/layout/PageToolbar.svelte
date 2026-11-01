<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    title?: string;
    description?: string;
    sticky?: boolean;
    class?: string;
    left?: Snippet;
    right?: Snippet;
  }

  let {
    title,
    description,
    sticky = false,
    class: className = '',
    left,
    right,
  }: Props = $props();
</script>

<div
  class={cn(
    'z-20 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] py-2.5',
    sticky && 'olive-glass sticky top-0',
    className,
  )}
>
  <div class="flex min-w-0 flex-wrap items-center gap-2">
    {#if title}
      <h2 class="truncate text-[13px] font-semibold text-[var(--foreground)]">{title}</h2>
    {/if}
    {#if description}
      <span class="text-xs text-[var(--muted-foreground)]">{description}</span>
    {/if}
    {#if left}{@render left()}{/if}
  </div>
  {#if right}
    <div class="flex flex-wrap items-center gap-1.5">{@render right()}</div>
  {/if}
</div>
