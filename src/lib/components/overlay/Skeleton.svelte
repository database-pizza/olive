<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    width?: string;
    height?: string;
    rounded?: boolean;
  }

  let { class: className = '', width, height, rounded = false }: Props = $props();
</script>

<div
  class={cn(
    'animate-[shimmer_1.8s_ease-in-out_infinite]',
    'bg-[var(--muted)]',
    rounded ? 'rounded-full' : 'rounded-[var(--radius)]',
    className
  )}
  style:width={width}
  style:height={height ?? '1rem'}
></div>

<style>
  @keyframes shimmer {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
</style>
