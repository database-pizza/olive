<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import Button from '$lib/components/primitives/Button.svelte';

  interface Props {
    open?: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onconfirm?: () => void;
    oncancel?: () => void;
  }

  let {
    open = $bindable(false),
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    destructive = false,
    onconfirm,
    oncancel,
  }: Props = $props();

  function cancel() {
    open = false;
    oncancel?.();
  }

  function confirm() {
    open = false;
    onconfirm?.();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') cancel();
  }
</script>

{#if open}
  <div
    role="presentation"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"></div>

    <div
      role="alertdialog"
      aria-modal="true"
      tabindex="-1"
      aria-labelledby="alert-title"
      aria-describedby={description ? 'alert-desc' : undefined}
      onkeydown={handleKeydown}
      class={cn(
        'relative z-10 w-full max-w-sm max-w-[calc(100vw-2rem)]',
        'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
        'shadow-[var(--shadow-lg)]',
        'animate-[slideUpFadeIn_250ms_cubic-bezier(0.16,1,0.3,1)]',
      )}
    >
      <div class="px-6 pt-6 pb-4">
        <h2 id="alert-title" class="text-base font-semibold text-[var(--foreground)]">{title}</h2>
        {#if description}
          <p id="alert-desc" class="mt-2 text-sm text-[var(--muted-foreground)]">{description}</p>
        {/if}
      </div>

      <div class="flex items-center justify-end gap-2 border-t border-[var(--border)] px-6 py-4">
        <Button variant="outline" size="sm" onclick={cancel}>{cancelLabel}</Button>
        <Button variant={destructive ? 'destructive' : 'default'} size="sm" onclick={confirm}>{confirmLabel}</Button>
      </div>
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
