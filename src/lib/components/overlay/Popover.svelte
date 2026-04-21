<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  type Align = 'start' | 'center' | 'end';
  type Side = 'top' | 'bottom' | 'left' | 'right';

  interface Props {
    open?: boolean;
    align?: Align;
    side?: Side;
    class?: string;
    trigger?: Snippet;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    align = 'start',
    side = 'bottom',
    class: className = '',
    trigger,
    children,
  }: Props = $props();

  let containerEl = $state<HTMLElement | null>(null);

  function toggle() { open = !open; }
  function close() { open = false; }

  function handleOutside(e: MouseEvent) {
    if (containerEl && !containerEl.contains(e.target as Node)) close();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  $effect(() => {
    if (open) {
      document.addEventListener('click', handleOutside);
      return () => document.removeEventListener('click', handleOutside);
    }
  });

  const sideClasses: Record<Side, string> = {
    bottom: 'top-full mt-2',
    top:    'bottom-full mb-2',
    left:   'right-full mr-2 top-0',
    right:  'left-full ml-2 top-0',
  };

  const alignClasses: Record<Align, string> = {
    start:  'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end:    'right-0',
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="relative inline-flex"
  bind:this={containerEl}
  onkeydown={handleKeydown}
>
  <div onclick={toggle} class="inline-flex">
    {#if trigger}{@render trigger()}{/if}
  </div>

  {#if open}
    <div
      class={cn(
        'absolute z-50 min-w-[220px]',
        'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
        'shadow-[var(--shadow-md)] p-4',
        'animate-[popoverIn_150ms_cubic-bezier(0.16,1,0.3,1)]',
        sideClasses[side],
        alignClasses[align],
        className
      )}
    >
      {#if children}{@render children()}{/if}
    </div>
  {/if}
</div>

<style>
  @keyframes popoverIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
</style>
