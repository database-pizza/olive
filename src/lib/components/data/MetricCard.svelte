<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  type Color = 'olive' | 'emerald' | 'amber' | 'red' | 'sky' | 'purple';

  interface Props {
    label: string;
    value: string | number;
    color?: Color;
    class?: string;
    icon?: Snippet;
    trend?: { value: number; label?: string };
    hint?: string;
    sparkline?: Snippet;
  }

  let {
    label,
    value,
    color = 'olive',
    class: className = '',
    icon,
    trend,
    hint,
    sparkline,
  }: Props = $props();

  const iconColor: Record<Color, string> = {
    olive: 'bg-[var(--brand-soft)] text-[var(--brand-strong)] dark:text-[var(--brand)]',
    emerald: 'bg-[var(--success-soft)] text-[var(--success-foreground-soft)]',
    amber: 'bg-[var(--warning-soft)] text-[var(--warning-foreground-soft)]',
    red: 'bg-[var(--destructive-soft)] text-[var(--destructive-foreground-soft)]',
    sky: 'bg-[var(--info-soft)] text-[var(--info-foreground-soft)]',
    purple: 'bg-[var(--debug-soft)] text-[var(--debug-foreground-soft)]',
  };
</script>

<div
  class={cn(
    'flex min-w-0 flex-col rounded-[var(--radius-xl)] border border-[var(--border)]',
    'bg-[var(--card)] p-3.5 shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)] sm:p-4',
    className,
  )}
>
  <div class="flex items-center justify-between gap-2">
    <p class="truncate text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--subtle-foreground)]">
      {label}
    </p>
    {#if icon}
      <span class={cn('flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)] [&_svg]:size-3.5', iconColor[color])}>
        {@render icon()}
      </span>
    {/if}
  </div>

  <div class="mt-2 flex items-end justify-between gap-2">
    <p class="olive-tnum text-[21px] font-semibold leading-none tracking-[-0.035em] text-[var(--foreground)] sm:text-[26px]">
      {value}
    </p>
    {#if trend}
      <span
        class={cn(
          'mb-0.5 inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
          trend.value > 0
            ? 'bg-[var(--success-soft)] text-[var(--success-foreground-soft)]'
            : trend.value < 0
              ? 'bg-[var(--destructive-soft)] text-[var(--destructive-foreground-soft)]'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)]',
        )}
      >
        {#if trend.value !== 0}
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d={trend.value > 0 ? 'M7 17 17 7M9 7h8v8' : 'M7 7l10 10M17 9v8H9'} />
          </svg>
        {/if}
        {Math.abs(trend.value)}%
      </span>
    {/if}
  </div>

  {#if hint || trend?.label}
    <p class="mt-1 truncate text-[11px] text-[var(--muted-foreground)]">{hint ?? trend?.label}</p>
  {/if}

  {#if sparkline}
    <div class="-mx-1 mt-3 opacity-90">
      {@render sparkline()}
    </div>
  {/if}
</div>
