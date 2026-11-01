<script lang="ts">
  import Button from '$lib/components/primitives/Button.svelte';
  import Dialog from '$lib/components/overlay/Dialog.svelte';

  interface Props {
    open?: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    loading?: boolean;
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
    loading = false,
    onconfirm,
    oncancel,
  }: Props = $props();

  function cancel() {
    open = false;
    oncancel?.();
  }

  function confirm() {
    if (loading) return;
    onconfirm?.();
  }
</script>

<Dialog bind:open {title} {description} size="sm" onclose={oncancel}>
  {#snippet footer()}
    <Button data-autofocus variant="outline" size="sm" onclick={cancel} disabled={loading}>
      {cancelLabel}
    </Button>
    <Button
      variant={destructive ? 'destructive' : 'default'}
      size="sm"
      onclick={confirm}
      {loading}
    >
      {confirmLabel}
    </Button>
  {/snippet}
</Dialog>
