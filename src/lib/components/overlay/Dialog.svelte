<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    class?: string;
    children?: Snippet;
    footer?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
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

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) close();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }
</script>

{#if open}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    role="presentation"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    onclick={handleBackdrop}
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"></div>

    <!-- Panel -->
    <div
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      aria-labelledby={title ? 'dialog-title' : undefined}
      aria-describedby={description ? 'dialog-desc' : undefined}
      onkeydown={handleKeydown}
      class={cn(
        'relative z-10 w-full max-w-md max-w-[calc(100vw-2rem)]',
        'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
        'shadow-[var(--shadow-lg)]',
        'animate-[slideUpFadeIn_250ms_cubic-bezier(0.16,1,0.3,1)]',
        className
      )}
    >
      <!-- Header -->
      {#if title || description}
        <div class="px-6 pt-6 pb-4">
          {#if title}
            <h2 id="dialog-title" class="text-base font-semibold text-[var(--foreground)]">{title}</h2>
          {/if}
          {#if description}
            <p id="dialog-desc" class="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
          {/if}
        </div>
      {/if}

      <!-- Close button -->
      <button
        type="button"
        onclick={close}
        aria-label="Close dialog"
        class={cn(
          'absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-[calc(var(--radius)*0.67)]',
          'cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]',
          'transition-all duration-[150ms]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      <!-- Body -->
      {#if children}
        <div class="px-6 {title || description ? 'pb-4' : 'pt-6 pb-4'}">
          {@render children()}
        </div>
      {/if}

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
  @keyframes slideUpFadeIn {
    from { opacity: 0; transform: translateY(8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
</style>
