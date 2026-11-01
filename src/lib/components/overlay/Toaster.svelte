<script lang="ts">
  import { toast, type ToastVariant } from '$lib/utils/toast.svelte.js';
  import { cn } from '$lib/utils/cn.js';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  let drag = $state<{ id: string | null; x: number; startX: number }>({
    id: null,
    x: 0,
    startX: 0,
  });

  function startDrag(event: PointerEvent, id: string) {
    if (event.pointerType === 'mouse') return;
    if ((event.target as HTMLElement).closest('button')) return;
    drag = { id, x: 0, startX: event.clientX };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent) {
    if (!drag.id) return;
    drag = { ...drag, x: event.clientX - drag.startX };
  }

  function endDrag(id: string) {
    if (!drag.id) return;
    if (Math.abs(drag.x) > 84) toast.remove(id);
    drag = { id: null, x: 0, startX: 0 };
  }

  const variants: Record<
    ToastVariant,
    { ring: string; icon: string; iconColor: string }
  > = {
    default: {
      ring: 'border-[var(--border)]',
      icon: 'bg-[var(--muted)]',
      iconColor: 'text-[var(--muted-foreground)]',
    },
    success: {
      ring: 'border-[color-mix(in_oklab,var(--success)_28%,transparent)]',
      icon: 'bg-[var(--success-soft)]',
      iconColor: 'text-[var(--success-foreground-soft)]',
    },
    warning: {
      ring: 'border-[color-mix(in_oklab,var(--warning)_30%,transparent)]',
      icon: 'bg-[var(--warning-soft)]',
      iconColor: 'text-[var(--warning-foreground-soft)]',
    },
    error: {
      ring: 'border-[color-mix(in_oklab,var(--destructive)_28%,transparent)]',
      icon: 'bg-[var(--destructive-soft)]',
      iconColor: 'text-[var(--destructive-foreground-soft)]',
    },
    info: {
      ring: 'border-[color-mix(in_oklab,var(--info)_28%,transparent)]',
      icon: 'bg-[var(--info-soft)]',
      iconColor: 'text-[var(--info-foreground-soft)]',
    },
  };
</script>

<div
  aria-live="polite"
  aria-atomic="false"
  class="pointer-events-none fixed inset-x-3 bottom-3 z-[130] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[360px] olive-safe-bottom"
>
  {#each toast.toasts as t (t.id)}
    {@const style = variants[t.variant]}
    <div
      role="status"
      in:fly={{ y: 12, duration: 240, easing: cubicOut }}
      out:fly={{ y: 8, duration: 160 }}
      onpointerdown={(event) => startDrag(event, t.id)}
      onpointermove={moveDrag}
      onpointerup={() => endDrag(t.id)}
      onpointercancel={() => endDrag(t.id)}
      style:transform={drag.id === t.id && drag.x !== 0 ? `translate3d(${drag.x}px, 0, 0)` : undefined}
      style:opacity={drag.id === t.id ? String(Math.max(0.4, 1 - Math.abs(drag.x) / 240)) : undefined}
      class={cn(
        'pointer-events-auto flex items-start gap-3 rounded-[var(--radius-lg)] border bg-[var(--popover)] p-3',
        'shadow-[var(--olive-shadow-lg)]',
        style.ring,
      )}
    >
      <span
        class={cn(
          'mt-px flex size-6 shrink-0 items-center justify-center rounded-full',
          style.icon,
          style.iconColor,
        )}
        aria-hidden="true"
      >
        {#if t.variant === 'success'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        {:else if t.variant === 'error'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        {:else if t.variant === 'warning'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 9v4M12 17h.01" />
          </svg>
        {:else}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" />
          </svg>
        {/if}
      </span>

      <div class="min-w-0 flex-1 pt-0.5">
        <p class="text-[13px] font-medium leading-snug text-[var(--foreground)]">{t.message}</p>
        {#if t.description}
          <p class="mt-0.5 text-xs leading-relaxed text-[var(--muted-foreground)]">{t.description}</p>
        {/if}
        {#if t.action}
          <button
            type="button"
            onclick={() => {
              t.action?.onclick();
              toast.remove(t.id);
            }}
            class="mt-2 rounded-[var(--radius-xs)] text-xs font-semibold text-[var(--brand-strong)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:text-[var(--brand)]"
          >
            {t.action.label}
          </button>
        {/if}
      </div>

      <button
        type="button"
        onclick={() => toast.remove(t.id)}
        aria-label="Dismiss notification"
        class="flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-xs)] text-[var(--subtle-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  {/each}
</div>
