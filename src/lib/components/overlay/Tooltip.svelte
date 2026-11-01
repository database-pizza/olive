<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { popupElement } from '$lib/utils/popup.js';
  import { popIn, popOut } from '$lib/utils/transitions.js';

  type Side = 'top' | 'bottom' | 'left' | 'right';

  interface Props {
    content: string;
    side?: Side;
    delay?: number;
    class?: string;
    children?: Snippet;
  }

  let {
    content,
    side = 'top',
    delay = 350,
    class: className = '',
    children,
  }: Props = $props();

  let visible = $state(false);
  let wrapperEl = $state<HTMLElement | null>(null);
  let pos = $state<{ top: number; left: number; placement: Side }>({ top: 0, left: 0, placement: 'top' });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const componentId = $props.id();
  const tooltipId = `${componentId}-tooltip`;

  function measure() {
    if (!wrapperEl || typeof window === 'undefined') return;
    const rect = wrapperEl.getBoundingClientRect();
    const gap = 8;
    const tooltipWidth = 180;
    let placement = side;
    if (side === 'top' && rect.top < 48) placement = 'bottom';
    if (side === 'bottom' && window.innerHeight - rect.bottom < 48) placement = 'top';
    if (side === 'left' && rect.left < tooltipWidth) placement = 'right';
    if (side === 'right' && window.innerWidth - rect.right < tooltipWidth) placement = 'left';

    let top = rect.top;
    let left = rect.left + rect.width / 2;
    if (placement === 'top') top = rect.top - gap;
    if (placement === 'bottom') top = rect.bottom + gap;
    if (placement === 'left') {
      left = rect.left - gap;
      top = rect.top + rect.height / 2;
    }
    if (placement === 'right') {
      left = rect.right + gap;
      top = rect.top + rect.height / 2;
    }

    pos = { top, left, placement };
  }

  function show() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      measure();
      visible = true;
    }, delay);
  }

  function hide() {
    clearTimeout(timer);
    visible = false;
  }

  function describeTrigger(node: HTMLElement) {
    const trigger = popupElement(node);
    const previous = trigger?.getAttribute('aria-describedby');
    const description = [previous, tooltipId].filter(Boolean).join(' ');
    trigger?.setAttribute('aria-describedby', description);
    return {
      destroy() {
        if (!trigger) return;
        if (previous) trigger.setAttribute('aria-describedby', previous);
        else trigger.removeAttribute('aria-describedby');
      },
    };
  }

  $effect(() => {
    if (!visible) return;
    const onViewport = () => measure();
    document.addEventListener('scroll', onViewport, true);
    window.addEventListener('resize', onViewport);
    return () => {
      document.removeEventListener('scroll', onViewport, true);
      window.removeEventListener('resize', onViewport);
    };
  });

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }
</script>

<div
  bind:this={wrapperEl}
  use:describeTrigger
  role="group"
  class={cn('relative inline-flex', className)}
  onmouseenter={show}
  onmouseleave={hide}
  onfocusin={show}
  onfocusout={hide}
>
  {#if children}{@render children()}{/if}
</div>

{#if visible}
  <div
    use:portal
    id={tooltipId}
    role="tooltip"
    in:popIn={{ y: 3, duration: 140 }}
    out:popOut={{ y: 2, duration: 90 }}
    class="pointer-events-none fixed z-[120] max-w-[min(18rem,calc(100vw-1rem))] whitespace-normal rounded-[var(--radius-sm)] bg-[var(--foreground)] px-2 py-1 text-[11px] font-medium leading-snug text-[var(--background)] shadow-[var(--olive-shadow-md)]"
    style:top="{pos.top}px"
    style:left="{pos.left}px"
    style:transform={pos.placement === 'top'
      ? 'translate(-50%, -100%)'
      : pos.placement === 'bottom'
        ? 'translate(-50%, 0)'
        : pos.placement === 'left'
          ? 'translate(-100%, -50%)'
          : 'translate(0, -50%)'}
  >
    {content}
  </div>
{/if}
