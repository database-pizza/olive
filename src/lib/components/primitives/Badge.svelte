<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  type Variant =
    | 'default'
    | 'brand'
    | 'outline'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral'
    | 'active'
    | 'paused'
    | 'error'
    | 'debug'
    | 'trace'
    | 'write'
    | 'delete';
  type Size = 'sm' | 'md';

  interface Props {
    variant?: Variant;
    size?: Size;
    dot?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = 'default',
    size = 'sm',
    dot = false,
    class: className = '',
    children,
  }: Props = $props();

  const base =
    'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-medium leading-none';

  const variants: Record<Variant, string> = {
    default: 'border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]',
    brand: 'border-transparent bg-[var(--brand-soft)] text-[var(--brand-strong)] dark:text-[var(--brand)]',
    outline: 'border-[var(--border)] bg-transparent text-[var(--muted-foreground)]',
    neutral: 'border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]',
    success: 'badge-active',
    active: 'badge-active',
    warning: 'badge-warning',
    paused: 'badge-paused',
    danger: 'badge-error',
    error: 'badge-error',
    info: 'badge-info',
    write: 'badge-write',
    debug: 'badge-debug',
    delete: 'badge-delete',
    trace: 'badge-trace',
  };

  const dots: Record<Variant, string> = {
    default: 'bg-[var(--muted-foreground)]',
    brand: 'bg-[var(--brand)]',
    outline: 'bg-[var(--muted-foreground)]',
    neutral: 'bg-[var(--muted-foreground)]',
    success: 'bg-[var(--success)]',
    active: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    paused: 'bg-[var(--warning)]',
    danger: 'bg-[var(--destructive)]',
    error: 'bg-[var(--destructive)]',
    info: 'bg-[var(--info)]',
    write: 'bg-[var(--info)]',
    debug: 'bg-[var(--debug)]',
    delete: 'bg-[var(--destructive)]',
    trace: 'bg-[var(--muted-foreground)]',
  };

  const sizes: Record<Size, string> = {
    sm: 'h-5 px-2 text-[11px]',
    md: 'h-6 px-2.5 text-xs',
  };
</script>

<span class={cn(base, variants[variant], sizes[size], className)}>
  {#if dot}
    <span class={cn('size-1.5 rounded-full', dots[variant])} aria-hidden="true"></span>
  {/if}
  {#if children}{@render children()}{/if}
</span>
