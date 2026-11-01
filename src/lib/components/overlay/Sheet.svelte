<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cn } from '$lib/utils/cn.js';
  import { modal } from '$lib/utils/modal.js';
  import { sheetIn, sheetOut } from '$lib/utils/transitions.js';

  type Side = 'left' | 'right' | 'top' | 'bottom';

  interface Props {
    open?: boolean;
    side?: Side;
    title?: string;
    description?: string;
    class?: string;
    children?: Snippet;
    footer?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    side = 'right',
    title,
    description,
    class: className = '',
    children,
    footer,
    onclose,
  }: Props = $props();

  const sheetId = $props.id();
  let dragY = $state(0);
  let dragging = $state(false);
  let dragStart = 0;

  function close() {
    open = false;
    onclose?.();
  }

  function handleBackdrop(event: MouseEvent) {
    if (event.target === event.currentTarget) close();
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }

  function onPointerDown(event: PointerEvent) {
    if (event.pointerType === 'mouse' || side !== 'bottom') return;
    dragging = true;
    dragStart = event.clientY;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging) return;
    dragY = Math.max(0, event.clientY - dragStart);
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    if (dragY > 96) close();
    dragY = 0;
  }

  const panelClasses: Record<Side, string> = {
    right: 'inset-y-0 right-0 h-full w-full max-w-sm border-l',
    left: 'inset-y-0 left-0 h-full w-full max-w-sm border-r',
    top: 'inset-x-0 top-0 max-h-[75dvh] w-full rounded-b-[var(--radius-2xl)] border-b',
    bottom:
      'inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-[var(--radius-2xl)] border-t olive-safe-bottom',
  };
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    use:portal
    role="presentation"
    class="fixed inset-0 z-[100]"
    onclick={handleBackdrop}
  >
    <div
      class="absolute inset-0 bg-[oklch(0.15_0.01_100/0.44)] backdrop-blur-[2px]"
      transition:fade={{ duration: 180 }}
    ></div>

    <div
      use:modal={{ onEscape: close, initialFocus: '[data-autofocus], input:not([type="hidden"]):not(:disabled), textarea:not(:disabled), select:not(:disabled)' }}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      aria-labelledby={title ? `${sheetId}-title` : undefined}
      aria-describedby={description ? `${sheetId}-description` : undefined}
      in:sheetIn={{ side }}
      out:sheetOut={{ side }}
      style:transform={dragY > 0 ? `translate3d(0, ${dragY}px, 0)` : undefined}
      style:transition={dragging ? 'none' : undefined}
      class={cn(
        'absolute flex flex-col overflow-hidden border-[var(--border)] bg-[var(--popover)]',
        'shadow-[var(--olive-shadow-lg)]',
        side === 'bottom' && 'h-auto',
        panelClasses[side],
        className,
      )}
    >
      {#if side === 'bottom'}
        <div
          class="flex shrink-0 cursor-grab touch-none justify-center pt-2.5"
          onpointerdown={onPointerDown}
          onpointermove={onPointerMove}
          onpointerup={onPointerUp}
          onpointercancel={onPointerUp}
          aria-hidden="true"
        >
          <span class="h-1 w-9 rounded-full bg-[var(--border-strong)]"></span>
        </div>
      {/if}

      <div class="flex shrink-0 items-start justify-between gap-4 px-5 py-4">
        <div class="min-w-0">
          {#if title}
            <h2 id={`${sheetId}-title`} class="text-[15px] font-semibold tracking-[-0.01em] text-[var(--foreground)]">
              {title}
            </h2>
          {/if}
          {#if description}
            <p id={`${sheetId}-description`} class="mt-1 text-[13px] leading-relaxed text-[var(--muted-foreground)]">
              {description}
            </p>
          {/if}
        </div>
        <button
          type="button"
          onclick={close}
          aria-label="Close"
          class="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">
        {#if children}{@render children()}{/if}
      </div>

      {#if footer}
        <div class="flex shrink-0 items-center justify-end gap-2 border-t border-[var(--border)] px-5 py-3">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
