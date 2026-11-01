<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    width?: string;
    height?: string;
    rounded?: boolean | 'sm' | 'md' | 'lg' | 'full';
  }

  let { class: className = '', width, height, rounded = false }: Props = $props();

  const radius = $derived(
    rounded === 'full'
      ? 'rounded-full'
      : rounded === 'sm'
        ? 'rounded-[var(--radius-sm)]'
        : rounded === 'md'
          ? 'rounded-[var(--radius-button)]'
          : rounded === 'lg'
            ? 'rounded-[var(--radius-xl)]'
            : rounded
              ? 'rounded-[var(--radius)]'
              : 'rounded-[var(--radius-sm)]',
  );
</script>

<div
  aria-hidden="true"
  class={cn(
    'bg-[linear-gradient(90deg,var(--muted)_25%,var(--accent)_50%,var(--muted)_75%)] bg-[length:200%_100%]',
    'animate-[olive-shimmer_1.8s_linear_infinite]',
    radius,
    className,
  )}
  style:width
  style:height={height ?? '1rem'}
></div>
