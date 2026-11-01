<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import Button from '$lib/components/primitives/Button.svelte';
  import { modal } from '$lib/utils/modal.js';

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

  const dialogId = $props.id();

  function cancel() {
    open = false;
    oncancel?.();
  }

  function confirm() {
    open = false;
    onconfirm?.();
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }
</script>

{#if open}
  <div
    use:portal
    role="presentation"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
  >
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"></div>

    <div
      use:modal={{ onEscape: cancel, initialFocus: '[data-modal-autofocus]' }}
      role="alertdialog"
      aria-modal="true"
      tabindex="-1"
      aria-labelledby={`${dialogId}-title`}
      aria-describedby={description ? `${dialogId}-description` : undefined}
      class={cn(
        'relative z-10 w-full max-w-sm',
        'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
        'shadow-[var(--shadow-lg)]',
        'animate-[slideUpFadeIn_250ms_cubic-bezier(0.16,1,0.3,1)]',
      )}
    >
      <div class="px-6 pt-6 pb-4">
        <h2 id={`${dialogId}-title`} class="text-base font-semibold text-[var(--foreground)]">{title}</h2>
        {#if description}
          <p id={`${dialogId}-description`} class="mt-2 text-sm text-[var(--muted-foreground)]">{description}</p>
        {/if}
      </div>

      <div class="flex items-center justify-end gap-2 border-t border-[var(--border)] px-6 py-4">
        <Button data-modal-autofocus variant="outline" size="sm" onclick={cancel}>{cancelLabel}</Button>
        <Button variant={destructive ? 'destructive' : 'default'} size="sm" onclick={confirm}>{confirmLabel}</Button>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes -global-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes -global-slideUpFadeIn {
    from { opacity: 0; transform: translateY(8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
</style>
