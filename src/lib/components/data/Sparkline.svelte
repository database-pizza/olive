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
    primary: 'var(--brand)',
    emerald: 'var(--success)',
    amber: 'var(--warning)',
    red: 'var(--destructive)',
    sky: 'var(--info)',
  };

  const gradientId = $props.id();

  const points = $derived.by(() => {
    if (values.length === 0) return [];
    const max = Math.max(...values);
    const min = Math.min(...values);
    const span = max - min || 1;
    const step = values.length > 1 ? width / (values.length - 1) : width;
    return values.map((value, index) => {
      const x = index * step;
      const y = height - 2 - ((value - min) / span) * (height - 4);
      return [x, y] as const;
    });
  });

  // Catmull-Rom → cubic Bézier keeps the line soft without inventing peaks.
  const path = $derived.by(() => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M${points[0][0]},${points[0][1]}`;
    let d = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
    }
    return d;
  });

  const area = $derived(
    points.length > 1 ? `${path} L${width},${height} L0,${height} Z` : '',
  );
</script>

<svg
  viewBox={`0 0 ${width} ${height}`}
  preserveAspectRatio="none"
  role={label ? 'img' : 'presentation'}
  aria-label={label}
  class={cn('block overflow-visible', className)}
  style:width="{width}px"
  style:height="{height}px"
>
  {#if filled && area}
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color={strokes[tone]} stop-opacity="0.18" />
        <stop offset="100%" stop-color={strokes[tone]} stop-opacity="0" />
      </linearGradient>
    </defs>
    <path d={area} fill="url(#{gradientId})" />
  {/if}
  <path
    d={path}
    fill="none"
    stroke={strokes[tone]}
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    vector-effect="non-scaling-stroke"
  />
  {#if points.length > 0}
    <circle
      cx={points[points.length - 1][0]}
      cy={points[points.length - 1][1]}
      r="2"
      fill={strokes[tone]}
    />
  {/if}
</svg>
