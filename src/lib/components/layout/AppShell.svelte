<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    inset?: boolean;
    header?: Snippet;
    bottomBar?: Snippet;
    sidebar?: Snippet;
    children?: Snippet;
  }

  let {
    class: className = '',
    inset = true,
    header,
    bottomBar,
    sidebar,
    children,
  }: Props = $props();
</script>

<div class={cn('flex h-dvh overflow-hidden bg-[var(--sidebar)]', className)}>
  {#if sidebar}{@render sidebar()}{/if}

  <div class="flex min-w-0 flex-1 flex-col lg:min-h-0 lg:p-2">
    <div
      class={cn(
        'relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--background)]',
        inset && 'lg:rounded-[var(--radius-2xl)] lg:border lg:border-[var(--border)] lg:shadow-[var(--olive-inset-highlight),0_1px_3px_oklch(0.2_0.01_100/0.06)]',
      )}
    >
      {#if header}{@render header()}{/if}
      <main class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        {#if children}{@render children()}{/if}
      </main>
    </div>
    {#if bottomBar}
      <div class="shrink-0 lg:hidden">{@render bottomBar()}</div>
    {/if}
  </div>
</div>
