<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { popupElement } from '$lib/utils/popup.js';

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
  const componentId = $props.id();
  const tooltipId = `${componentId}-tooltip`;

  function describeTrigger(node: HTMLElement) {
    const trigger = popupElement(node);
    const previousDescription = trigger?.getAttribute('aria-describedby');
    const description = [previousDescription, tooltipId].filter(Boolean).join(' ');
    trigger?.setAttribute('aria-describedby', description);

    return {
      destroy() {
        if (!trigger) return;
        if (previousDescription) trigger.setAttribute('aria-describedby', previousDescription);
        else trigger.removeAttribute('aria-describedby');
      },
    };
  }

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
  use:describeTrigger
  role="group"
  class={cn('relative inline-flex', className)}
  onmouseenter={show}
  onmouseleave={hide}
  onfocus={show}
  onblur={hide}
>
  {#if children}{@render children()}{/if}

  <div
    id={tooltipId}
    role="tooltip"
    hidden={!visible}
    class={cn(
      'pointer-events-none absolute z-50 whitespace-nowrap',
      'rounded-[calc(var(--radius)*0.67)] bg-[var(--foreground)] px-2.5 py-1',
      'text-xs font-medium text-[var(--background)]',
      'shadow-[var(--shadow-md)]',
      'animate-[tooltipIn_150ms_cubic-bezier(0.16,1,0.3,1)]',
      sideClasses[side],
    )}
  >
    {content}
  </div>
</div>

<style>
  @keyframes -global-tooltipIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
</style>
