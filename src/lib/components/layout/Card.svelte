<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    interactive?: boolean;
    inset?: boolean;
    children?: Snippet;
  }

  let { class: className = '', interactive = false, inset = false, children }: Props = $props();
</script>

<div
  class={cn(
    'relative flex flex-col rounded-[var(--radius-xl)] border border-[var(--border)]',
    'bg-[var(--card)] text-[var(--card-foreground)]',
    'shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)]',
    inset && 'bg-[color-mix(in_oklab,var(--card)_60%,var(--background))]',
    interactive && [
      'olive-lift cursor-pointer',
      'hover:border-[var(--border-strong)]',
      'focus-within:border-[var(--ring)]',
    ],
    className,
  )}
>
  {#if children}{@render children()}{/if}
</div>
