<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  type Side = 'top' | 'bottom' | 'left' | 'right';

  interface Props {
    content: string;
    side?: Side;
    delay?: number;
    class?: string;
    children?: Snippet;
  }

  let { content, side = 'top', delay = 400, class: className = '', children }: Props = $props();

  let visible = $state(false);
  let timer: ReturnType<typeof setTimeout>;

  function show() {
    timer = setTimeout(() => { visible = true; }, delay);
  }

  function hide() {
    clearTimeout(timer);
    visible = false;
  }

  const sideClasses: Record<Side, string> = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2',
  };
</script>

<div
  role="group"
  class={cn('relative inline-flex', className)}
  onmouseenter={show}
  onmouseleave={hide}
  onfocus={show}
  onblur={hide}
>
  {#if children}{@render children()}{/if}

  {#if visible}
    <div
      role="tooltip"
      class={cn(
        'pointer-events-none absolute z-50 whitespace-nowrap',
        'rounded-[calc(var(--radius)*0.67)] bg-[var(--foreground)] px-2.5 py-1',
        'text-xs font-medium text-[var(--background)]',
        'shadow-[var(--shadow-md)]',
        'animate-[fadeInScale_150ms_cubic-bezier(0.16,1,0.3,1)]',
        sideClasses[side],
      )}
    >
      {content}
    </div>
  {/if}
</div>

<style>
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.92) translateX(-50%); }
    to   { opacity: 1; transform: scale(1) translateX(-50%); }
  }
</style>
