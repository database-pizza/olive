<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cn } from '$lib/utils/cn.js';
  import { modal } from '$lib/utils/modal.js';
  import { surfaceIn, surfaceOut } from '$lib/utils/transitions.js';

  type Size = 'sm' | 'md' | 'lg' | 'xl';

  interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    size?: Size;
    class?: string;
    children?: Snippet;
    footer?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    title,
    description,
    size = 'md',
    class: className = '',
    children,
    footer,
    onclose,
  }: Props = $props();

  const dialogId = $props.id();
  let dragging = $state(false);
  let dragY = $state(0);
  let dragStart = 0;

  const sizes: Record<Size, string> = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-2xl',
  };

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
    if (event.pointerType === 'mouse') return;
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
    if (dragY > 88) close();
    dragY = 0;
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    use:portal
    role="presentation"
    class="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
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
      aria-labelledby={title ? `${dialogId}-title` : undefined}
      aria-describedby={description ? `${dialogId}-description` : undefined}
      in:surfaceIn
      out:surfaceOut
      style:transform={dragY > 0 ? `translate3d(0, ${dragY}px, 0)` : undefined}
      style:transition={dragging ? 'none' : undefined}
      class={cn(
        'relative z-10 flex max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden',
        'rounded-t-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--popover)]',
        'shadow-[var(--olive-shadow-lg)] sm:max-h-[calc(100dvh-2rem)] sm:rounded-[var(--radius-xl)]',
        'olive-safe-bottom',
        sizes[size],
        className,
      )}
    >
      <!-- phone drag handle -->
      <div
        class="flex shrink-0 cursor-grab touch-none items-center justify-center pb-1 pt-2.5 sm:hidden"
        onpointerdown={onPointerDown}
        onpointermove={onPointerMove}
        onpointerup={onPointerUp}
        onpointercancel={onPointerUp}
        aria-hidden="true"
      >
        <span class="h-1 w-9 rounded-full bg-[var(--border-strong)]"></span>
      </div>

      {#if title || description}
        <div class="shrink-0 px-4 pb-3 pt-3 sm:px-5 sm:pt-5">
          {#if title}
            <h2
              id={`${dialogId}-title`}
              class="pr-8 text-[15px] font-semibold tracking-[-0.01em] text-[var(--foreground)]"
            >
              {title}
            </h2>
          {/if}
          {#if description}
            <p
              id={`${dialogId}-description`}
              class="mt-1 text-[13px] leading-relaxed text-[var(--muted-foreground)]"
            >
              {description}
            </p>
          {/if}
        </div>
      {/if}

      <button
        type="button"
        onclick={close}
        aria-label="Close dialog"
        class={cn(
          'absolute right-3 top-3 flex size-7 items-center justify-center rounded-[var(--radius-sm)]',
          'text-[var(--muted-foreground)] transition-colors',
          'hover:bg-[var(--accent)] hover:text-[var(--foreground)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
          !title && !description && 'sm:top-4',
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {#if children}
        <div
          class={cn(
            'min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-5',
            title || description ? 'pb-4' : 'pt-4 sm:pt-5',
          )}
        >
          {@render children()}
        </div>
      {/if}

      {#if footer}
        <div
          class="flex shrink-0 items-center justify-end gap-2 border-t border-[var(--border)] px-4 py-3 sm:px-5"
        >
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
