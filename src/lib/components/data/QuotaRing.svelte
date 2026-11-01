<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  type Tone = 'primary' | 'emerald' | 'amber' | 'red';

  interface Props {
    value: number;
    max: number;
    label?: string;
    sublabel?: string;
    size?: number;
    thickness?: number;
    tone?: Tone;
    class?: string;
    children?: Snippet;
  }

  let {
    value,
    max,
    label,
    sublabel,
    size = 120,
    thickness = 8,
    tone = 'primary',
    class: className = '',
    children,
  }: Props = $props();

  const radius = $derived((size - thickness) / 2);
  const circumference = $derived(2 * Math.PI * radius);
  const percent = $derived(max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0);
  const resolvedTone = $derived<Tone>(percent >= 100 ? 'red' : percent >= 85 ? 'amber' : tone);

  const strokes: Record<Tone, string> = {
    primary: 'var(--brand)',
    emerald: 'var(--success)',
    amber: 'var(--warning)',
    red: 'var(--destructive)',
  };
</script>

<div
  class={cn('relative inline-flex items-center justify-center', className)}
  style:width="{size}px"
  style:height="{size}px"
>
  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} class="-rotate-90" aria-hidden="true">
    <circle cx={size / 2} cy={size / 2} {radius} fill="none" stroke="var(--muted)" stroke-width={thickness} />
    <circle
      cx={size / 2}
      cy={size / 2}
      {radius}
      fill="none"
      stroke={strokes[resolvedTone]}
      stroke-width={thickness}
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={circumference - (percent / 100) * circumference}
      style:transition="stroke-dashoffset 700ms var(--olive-ease-enter), stroke 300ms linear"
    />
  </svg>

  <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
    {#if children}
      {@render children()}
    {:else}
      <span class="olive-tnum text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
        {Math.round(percent)}<span class="text-sm text-[var(--muted-foreground)]">%</span>
      </span>
      {#if label}
        <span class="mt-0.5 max-w-[80%] truncate text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--subtle-foreground)]">
          {label}
        </span>
      {/if}
    {/if}
  </div>
  {#if sublabel}
    <span class="sr-only">{sublabel}</span>
  {/if}
</div>
