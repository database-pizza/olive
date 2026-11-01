<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    width?: 'default' | 'wide' | 'full' | 'prose';
    padded?: boolean;
    children?: Snippet;
  }

  let { class: className = '', width = 'default', padded = true, children }: Props = $props();

  const widths = {
    prose: 'max-w-3xl',
    default: 'max-w-6xl',
    wide: 'max-w-[96rem]',
    full: 'max-w-none',
  } as const;
</script>

<div class={cn('min-h-full bg-[var(--background)]', className)}>
  <div
    class={cn(
      'mx-auto w-full',
      widths[width],
      padded && 'px-4 py-5 sm:px-6 sm:py-7 lg:px-8',
    )}
  >
    {#if children}{@render children()}{/if}
  </div>
</div>
