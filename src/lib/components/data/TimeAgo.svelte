<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    value: Date | string | number | null | undefined;
    fallback?: string;
    class?: string;
    live?: boolean;
  }

  let { value, fallback = '—', class: className = '', live = true }: Props = $props();

  let now = $state(Date.now());

  $effect(() => {
    if (!live || typeof window === 'undefined') return;
    const id = setInterval(() => (now = Date.now()), 30_000);
    return () => clearInterval(id);
  });

  let date = $derived.by(() => {
    if (value === null || value === undefined || value === '') return null;
    const parsed = value instanceof Date ? value : new Date(
      typeof value === 'number' && value < 10_000_000_000 ? value * 1000 : value,
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  });

  let relative = $derived.by(() => {
    if (!date) return fallback;
    const diff = now - date.getTime();
    const future = diff < 0;
    const seconds = Math.abs(diff) / 1000;

    if (seconds < 45) return future ? 'in a moment' : 'just now';

    const format = (amount: number, unit: string) => {
      const rounded = Math.round(amount);
      const plural = rounded === 1 ? '' : 's';
      return future ? `in ${rounded} ${unit}${plural}` : `${rounded} ${unit}${plural} ago`;
    };

    const minutes = seconds / 60;
    if (minutes < 60) return format(minutes, 'minute');
    const hours = minutes / 60;
    if (hours < 24) return format(hours, 'hour');
    const days = hours / 24;
    if (days < 7) return format(days, 'day');
    const weeks = days / 7;
    if (weeks < 5) return format(weeks, 'week');
    const months = days / 30.44;
    if (months < 12) return format(months, 'month');
    return format(days / 365.25, 'year');
  });

  let absolute = $derived(date ? date.toLocaleString() : '');
</script>

<time
  datetime={date?.toISOString()}
  title={absolute}
  class={cn('text-[var(--muted-foreground)]', className)}
>
  {relative}
</time>
