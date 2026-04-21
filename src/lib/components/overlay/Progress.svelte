<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type Variant = 'default' | 'success' | 'warning' | 'error';

  interface Props {
    value?: number;
    max?: number;
    variant?: Variant;
    indeterminate?: boolean;
    class?: string;
  }

  let {
    value = 0,
    max = 100,
    variant = 'default',
    indeterminate = false,
    class: className = '',
  }: Props = $props();

  let percent = $derived(Math.min(100, Math.max(0, (value / max) * 100)));

  const fillClasses: Record<Variant, string> = {
    default: 'bg-[var(--primary)]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error:   'bg-red-500',
  };
</script>

<div
  role="progressbar"
  aria-valuenow={indeterminate ? undefined : value}
  aria-valuemin={0}
  aria-valuemax={max}
  class={cn(
    'relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]',
    className
  )}
>
  <div
    class={cn(
      'h-full rounded-full transition-all duration-[250ms]',
      fillClasses[variant],
      indeterminate && 'animate-[indeterminate_1.4s_ease-in-out_infinite]'
    )}
    style:width={indeterminate ? '40%' : `${percent}%`}
  ></div>
</div>

<style>
  @keyframes indeterminate {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(350%); }
  }
</style>
