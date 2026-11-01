<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import Tooltip from '$lib/components/overlay/Tooltip.svelte';

  interface Props {
    value: string;
    label?: string;
    copiedLabel?: string;
    class?: string;
    size?: number;
  }

  let {
    value,
    label = 'Copy',
    copiedLabel = 'Copied',
    class: className = '',
    size = 14,
  }: Props = $props();

  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function copy(event: MouseEvent) {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => (copied = false), 1500);
    } catch {
      copied = false;
    }
  }
</script>

<Tooltip content={copied ? copiedLabel : label}>
  <button
    type="button"
    onclick={copy}
    aria-label={copied ? copiedLabel : label}
    class={cn(
      'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[calc(var(--radius)*0.5)]',
      'text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]',
      className,
    )}
  >
    {#if copied}
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    {:else}
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    {/if}
  </button>
</Tooltip>
