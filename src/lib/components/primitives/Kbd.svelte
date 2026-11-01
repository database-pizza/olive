<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    children?: Snippet;
    size?: 'sm' | 'md';
  }

  let { class: className = '', children, size = 'md' }: Props = $props();
</script>

<kbd
  class={cn(
    'inline-flex select-none items-center justify-center rounded-[5px] border border-[var(--border)]',
    'bg-[var(--card)] font-mono font-medium text-[var(--muted-foreground)]',
    'shadow-[0_1px_0_var(--border)]',
    size === 'sm' ? 'h-4 min-w-4 px-1 text-[10px]' : 'h-5 min-w-5 px-1.5 text-[11px]',
    className,
  )}
>
  {#if children}{@render children()}{/if}
</kbd>
