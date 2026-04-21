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
  }

  let { label, value, color = 'olive', class: className = '', icon, trend }: Props = $props();

  const iconBg: Record<Color, string> = {
    olive:   'bg-[var(--primary)]/10',
    emerald: 'bg-emerald-500/10',
    amber:   'bg-amber-500/10',
    red:     'bg-red-500/10',
    sky:     'bg-sky-500/10',
    purple:  'bg-purple-500/10',
  };

  const iconColor: Record<Color, string> = {
    olive:   'text-[var(--primary)]',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber:   'text-amber-600 dark:text-amber-400',
    red:     'text-red-600 dark:text-red-400',
    sky:     'text-sky-600 dark:text-sky-400',
    purple:  'text-purple-600 dark:text-purple-400',
  };
</script>

<div
  class={cn(
    'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
    'shadow-[var(--shadow-sm)] p-4 flex items-center gap-3',
    className
  )}
>
  {#if icon}
    <div class={cn('shrink-0 rounded-[calc(var(--radius)*0.67)] p-2', iconBg[color])}>
      <span class={iconColor[color]}>
        {@render icon()}
      </span>
    </div>
  {/if}

  <div class="flex-1 min-w-0">
    <p class="text-xs text-[var(--muted-foreground)] truncate">{label}</p>
    <p class="text-lg font-semibold text-[var(--foreground)] leading-tight">{value}</p>
    {#if trend}
      <p class={cn(
        'text-xs mt-0.5',
        trend.value > 0 ? 'text-emerald-600 dark:text-emerald-400' : trend.value < 0 ? 'text-red-600 dark:text-red-400' : 'text-[var(--muted-foreground)]'
      )}>
        {trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '–'}
        {trend.label ?? `${Math.abs(trend.value)}%`}
      </p>
    {/if}
  </div>
</div>
