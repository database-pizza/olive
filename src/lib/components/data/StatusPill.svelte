<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
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
    neutral: 'border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]',
    success: 'border-[color-mix(in_oklab,var(--success)_28%,transparent)] bg-[var(--success-soft)] text-[var(--success-foreground-soft)]',
    warning: 'border-[color-mix(in_oklab,var(--warning)_30%,transparent)] bg-[var(--warning-soft)] text-[var(--warning-foreground-soft)]',
    danger: 'border-[color-mix(in_oklab,var(--destructive)_28%,transparent)] bg-[var(--destructive-soft)] text-[var(--destructive-foreground-soft)]',
    info: 'border-[color-mix(in_oklab,var(--info)_28%,transparent)] bg-[var(--info-soft)] text-[var(--info-foreground-soft)]',
    brand: 'border-[color-mix(in_oklab,var(--brand)_28%,transparent)] bg-[var(--brand-soft)] text-[var(--brand-strong)] dark:text-[var(--brand)]',
  };

  const dots: Record<Tone, string> = {
    neutral: 'bg-[var(--muted-foreground)]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    danger: 'bg-[var(--destructive)]',
    info: 'bg-[var(--info)]',
    brand: 'bg-[var(--brand)]',
  };

  const sizes: Record<Size, string> = {
    sm: 'h-5 gap-1.5 px-2 text-[11px]',
    md: 'h-6 gap-2 px-2.5 text-xs',
  };
</script>

<span
  class={cn(
    'inline-flex items-center whitespace-nowrap rounded-full border font-medium',
    tones[tone],
    sizes[size],
    className,
  )}
>
  {#if dot}
    <span class="relative flex size-1.5 shrink-0">
      {#if pulse}
        <span class={cn('absolute inline-flex size-full animate-ping rounded-full opacity-60', dots[tone])}></span>
      {/if}
      <span class={cn('relative inline-flex size-1.5 rounded-full', dots[tone])}></span>
    </span>
  {/if}
  {label}
</span>
