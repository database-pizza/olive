<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  type Size = 'sm' | 'md';

  interface Props {
    label: string;
    tone?: Tone;
    size?: Size;
    dot?: boolean;
    pulse?: boolean;
    class?: string;
  }

  let {
    label,
    tone = 'neutral',
    size = 'sm',
    dot = true,
    pulse = false,
    class: className = '',
  }: Props = $props();

  const tones: Record<Tone, string> = {
    neutral: 'bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]',
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
    danger: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/25',
    info: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25',
  };

  const dots: Record<Tone, string> = {
    neutral: 'bg-[var(--muted-foreground)]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-sky-500',
  };

  const sizes: Record<Size, string> = {
    sm: 'h-5 gap-1.5 px-2 text-[11px]',
    md: 'h-6 gap-2 px-2.5 text-xs',
  };
</script>

<span
  class={cn(
    'inline-flex items-center rounded-full border font-medium whitespace-nowrap',
    tones[tone],
    sizes[size],
    className,
  )}
>
  {#if dot}
    <span class="relative flex h-1.5 w-1.5">
      {#if pulse}
        <span class={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', dots[tone])}></span>
      {/if}
      <span class={cn('relative inline-flex h-1.5 w-1.5 rounded-full', dots[tone])}></span>
    </span>
  {/if}
  {label}
</span>
