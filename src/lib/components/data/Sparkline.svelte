<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type Tone = 'primary' | 'emerald' | 'amber' | 'red' | 'sky';

  interface Props {
    values: number[];
    width?: number;
    height?: number;
    tone?: Tone;
    filled?: boolean;
    class?: string;
    label?: string;
  }

  let {
    values,
    width = 96,
    height = 28,
    tone = 'primary',
    filled = true,
    class: className = '',
    label,
  }: Props = $props();

  const strokes: Record<Tone, string> = {
    primary: 'var(--primary)',
    emerald: 'var(--color-emerald-500, #10b981)',
    amber: 'var(--color-amber-500, #f59e0b)',
    red: 'var(--color-red-500, #ef4444)',
    sky: 'var(--color-sky-500, #0ea5e9)',
  };

  let points = $derived.by(() => {
    if (values.length === 0) return [];
    const max = Math.max(...values);
    const min = Math.min(...values);
    const span = max - min || 1;
    const step = values.length > 1 ? width / (values.length - 1) : width;
    return values.map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * (height - 2) - 1;
      return [x, y] as const;
    });
  });

  let line = $derived(points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
  let area = $derived(
    points.length > 1
      ? `M0,${height} L${line.replaceAll(' ', ' L')} L${width},${height} Z`
      : '',
  );
</script>

<svg
  viewBox={`0 0 ${width} ${height}`}
  {width}
  {height}
  role={label ? 'img' : 'presentation'}
  aria-label={label}
  class={cn('overflow-visible', className)}
  preserveAspectRatio="none"
>
  {#if filled && area}
    <path d={area} fill={strokes[tone]} opacity="0.12" />
  {/if}
  {#if points.length > 1}
    <polyline
      points={line}
      fill="none"
      stroke={strokes[tone]}
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  {/if}
</svg>
