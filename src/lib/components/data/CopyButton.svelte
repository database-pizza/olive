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
    size = 13,
  }: Props = $props();

  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function copy(event: MouseEvent) {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => (copied = false), 1600);
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
      'inline-flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-xs)]',
      'text-[var(--muted-foreground)] outline-none transition-[background-color,color,transform]',
      'duration-[var(--duration-fast)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]',
      'active:scale-90 focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
      copied && 'text-[var(--success-foreground-soft)] hover:text-[var(--success-foreground-soft)]',
      className,
    )}
  >
    {#if copied}
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    {:else}
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    {/if}
  </button>
</Tooltip>
