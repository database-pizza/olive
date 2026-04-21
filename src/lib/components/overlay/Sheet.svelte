<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

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

  function close() {
    open = false;
    onclose?.();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  const panelClasses: Record<Side, string> = {
    right:  'inset-y-0 right-0 h-full w-full max-w-sm translate-x-0 border-l',
    left:   'inset-y-0 left-0 h-full w-full max-w-sm border-r',
    top:    'inset-x-0 top-0 w-full max-h-[60vh] border-b',
    bottom: 'inset-x-0 bottom-0 w-full max-h-[60vh] border-t',
  };

  const enterFrom: Record<Side, string> = {
    right:  'translate-x-full',
    left:   '-translate-x-full',
    top:    '-translate-y-full',
    bottom: 'translate-y-full',
  };
</script>

{#if open}
  <div
    role="presentation"
    class="fixed inset-0 z-50 flex"
    onkeydown={handleKeydown}
  >
    <!-- Backdrop -->
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
      class="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
      onclick={close}
    ></div>

    <!-- Panel -->
    <div
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      aria-labelledby={title ? 'sheet-title' : undefined}
      class={cn(
        'absolute flex flex-col bg-[var(--card)] border-[var(--border)]',
        'shadow-[var(--shadow-lg)]',
        'animate-[sheetIn_250ms_cubic-bezier(0.16,1,0.3,1)]',
        panelClasses[side],
        className
      )}
    >
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 px-6 py-5 border-b border-[var(--border)]">
        <div>
          {#if title}
            <h2 id="sheet-title" class="text-base font-semibold text-[var(--foreground)]">{title}</h2>
          {/if}
          {#if description}
            <p class="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
          {/if}
        </div>
        <button
          type="button"
          onclick={close}
          aria-label="Close"
          class="cursor-pointer shrink-0 flex h-7 w-7 items-center justify-center rounded-[var(--radius-button)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors duration-[150ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto px-6 py-5">
        {#if children}{@render children()}{/if}
      </div>

      <!-- Footer -->
      {#if footer}
        <div class="flex items-center justify-end gap-2 border-t border-[var(--border)] px-6 py-4">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes sheetIn {
    from { opacity: 0; transform: translateX(100%); }
    to   { opacity: 1; transform: translateX(0); }
  }
</style>
