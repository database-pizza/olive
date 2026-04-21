<script lang="ts">
  import { toast, type ToastVariant } from '$lib/utils/toast.svelte.js';
  import { cn } from '$lib/utils/cn.js';

  const icons: Record<ToastVariant, string> = {
    default: '',
    success: '✓',
    warning: '⚠',
    error:   '✕',
  };

  const variantClasses: Record<ToastVariant, string> = {
    default: 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]',
    success: 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]',
    warning: 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]',
    error:   'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]',
  };

  const iconClasses: Record<ToastVariant, string> = {
    default: 'text-[var(--muted-foreground)]',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error:   'text-red-500',
  };
</script>

<div
  aria-live="polite"
  aria-atomic="false"
  class="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2 items-center pointer-events-none"
>
  {#each toast.toasts as t (t.id)}
    <div
      role="status"
      class={cn(
        'flex items-start gap-3 rounded-[var(--radius)] border px-4 py-3',
        'shadow-[var(--shadow-lg)] pointer-events-auto min-w-[280px] max-w-[420px]',
        'animate-[toastIn_200ms_cubic-bezier(0.16,1,0.3,1)]',
        variantClasses[t.variant]
      )}
    >
      {#if icons[t.variant]}
        <span class={cn('mt-0.5 text-sm font-bold shrink-0', iconClasses[t.variant])}>
          {icons[t.variant]}
        </span>
      {/if}
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium">{t.message}</p>
        {#if t.description}
          <p class="text-xs text-[var(--muted-foreground)] mt-0.5">{t.description}</p>
        {/if}
      </div>
      <button
        type="button"
        onclick={() => toast.remove(t.id)}
        aria-label="Dismiss"
        class={cn(
          'cursor-pointer shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
          'transition-colors duration-[150ms] focus-visible:outline-none'
        )}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  {/each}
</div>

<style>
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
