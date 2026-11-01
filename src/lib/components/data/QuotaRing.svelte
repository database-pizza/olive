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
    thickness = 10,
    tone = 'primary',
    class: className = '',
    children,
  }: Props = $props();

  const strokes: Record<Tone, string> = {
    primary: 'var(--primary)',
    emerald: 'var(--color-emerald-500, #10b981)',
    amber: 'var(--color-amber-500, #f59e0b)',
    red: 'var(--color-red-500, #ef4444)',
  };

  let percent = $derived(max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0);
  let radius = $derived((size - thickness) / 2);
  let circumference = $derived(2 * Math.PI * radius);

  let resolvedTone = $derived<Tone>(
    percent >= 100 ? 'red' : percent >= 80 ? 'amber' : tone,
  );

  let dash = $derived((percent / 100) * circumference);
</script>

<div class={cn('relative inline-flex items-center justify-center', className)} style={`width:${size}px;height:${size}px`}>
  <svg width={size} height={size} style={`width:${size}px;height:${size}px`} viewBox={`0 0 ${size} ${size}`} class="-rotate-90">
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke="var(--muted)"
      stroke-width={thickness}
    />
    <circle
      cx={size / 2}
      cy={size / 2}
      r={radius}
      fill="none"
      stroke={strokes[resolvedTone]}
      stroke-width={thickness}
      stroke-linecap="round"
      stroke-dasharray={`${dash} ${circumference}`}
      class="transition-[stroke-dasharray] duration-500 ease-out"
    />
  </svg>
  <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
    {#if children}
      {@render children()}
    {:else}
      <span class="text-lg font-semibold tabular-nums text-[var(--foreground)]">{Math.round(percent)}%</span>
      {#if label}
        <span class="text-[11px] text-[var(--muted-foreground)]">{label}</span>
      {/if}
      {#if sublabel}
        <span class="text-[10px] text-[var(--muted-foreground)]">{sublabel}</span>
      {/if}
    {/if}
  </div>
</div>
