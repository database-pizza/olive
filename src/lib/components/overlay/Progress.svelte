<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type Variant = 'default' | 'success' | 'warning' | 'error';
  type Size = 'sm' | 'md';

  interface Props {
    value?: number;
    max?: number;
    variant?: Variant;
    size?: Size;
    indeterminate?: boolean;
    label?: string;
    class?: string;
  }

  let {
    value = 0,
    max = 100,
    variant = 'default',
    size = 'md',
    indeterminate = false,
    label,
    class: className = '',
  }: Props = $props();

  const percent = $derived(Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0)));

  const fills: Record<Variant, string> = {
    default: 'bg-[var(--brand)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    error: 'bg-[var(--destructive)]',
  };
</script>

<div
  role="progressbar"
  aria-valuenow={indeterminate ? undefined : value}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-label={label}
  class={cn(
    'relative w-full overflow-hidden rounded-full bg-[var(--muted)]',
    size === 'sm' ? 'h-1' : 'h-1.5',
    className,
  )}
>
  <div
    class={cn(
      'relative h-full rounded-full transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-enter)]',
      fills[variant],
      indeterminate && 'w-2/5 animate-[olive-indeterminate_1.5s_var(--ease-soft)_infinite]',
    )}
    style:width={indeterminate ? undefined : `${percent}%`}
  >
    {#if !indeterminate && percent > 0}
      <span
        class="absolute inset-y-0 right-0 w-8 rounded-full bg-gradient-to-r from-transparent to-white/25"
        aria-hidden="true"
      ></span>
    {/if}
  </div>
</div>

<style>
  @keyframes -global-olive-indeterminate {
    0% { transform: translateX(-120%); }
    100% { transform: translateX(350%); }
  }
</style>
