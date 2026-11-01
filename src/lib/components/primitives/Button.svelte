<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils/cn.js';
  import Spinner from './Spinner.svelte';

  type Variant =
    | 'default'
    | 'brand'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'destructive-outline'
    | 'link';
  type Size = 'xs' | 'sm' | 'md' | 'lg' | 'icon-xs' | 'icon-sm' | 'icon' | 'icon-lg';

  interface Props extends HTMLButtonAttributes {
    href?: string;
    target?: HTMLAnchorAttributes['target'];
    rel?: string;
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = 'default',
    size = 'md',
    href,
    target,
    rel,
    disabled = false,
    loading = false,
    tabindex,
    type = 'button',
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const base = [
    'relative inline-flex shrink-0 select-none items-center justify-center gap-2',
    'whitespace-nowrap rounded-[var(--radius-button)] border font-medium',
    'outline-none transition-[background-color,border-color,color,box-shadow,opacity,transform]',
    'duration-[var(--duration-fast)] ease-[var(--ease-move)]',
    'focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
    'focus-visible:ring-offset-[var(--background)]',
    'disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
    'active:scale-[0.975]',
  ].join(' ');

  const variants: Record<Variant, string> = {
    default:
      'border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)] hover:bg-[var(--primary-hover)]',
    brand:
      'border-transparent bg-[var(--brand)] text-[var(--brand-foreground)] shadow-[var(--olive-shadow-xs),inset_0_1px_0_oklch(1_0_0/0.35)] hover:bg-[var(--brand-hover)]',
    secondary:
      'border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--accent)]',
    outline:
      'border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-[var(--olive-shadow-xs)] hover:border-[var(--border-strong)] hover:bg-[var(--accent)]',
    ghost:
      'border-transparent bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]',
    destructive:
      'border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-[var(--olive-shadow-xs),inset_0_1px_0_oklch(1_0_0/0.18)] hover:brightness-[1.06]',
    'destructive-outline':
      'border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[var(--card)] text-[var(--destructive-foreground-soft)] hover:bg-[var(--destructive-soft)]',
    link:
      'h-auto border-transparent bg-transparent px-0 text-[var(--foreground)] underline-offset-4 hover:underline',
  };

  const sizes: Record<Size, string> = {
    xs: 'h-7 gap-1 rounded-[var(--radius-sm)] px-2 text-[11px] sm:h-6',
    sm: 'h-8 gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-xs sm:h-7',
    md: 'h-9 px-3 text-[13px] sm:h-8',
    lg: 'h-10 px-4 text-sm sm:h-9',
    'icon-xs': 'size-7 rounded-[var(--radius-sm)] sm:size-6',
    'icon-sm': 'size-8 rounded-[var(--radius-sm)] sm:size-7',
    icon: 'size-9 sm:size-8',
    'icon-lg': 'size-10 sm:size-9',
  };

  function anchorAttributes(attributes: HTMLButtonAttributes): HTMLAnchorAttributes {
    return attributes as unknown as HTMLAnchorAttributes;
  }

  const isInactive = $derived(disabled || loading);
</script>

{#if href}
  <a
    {...anchorAttributes(rest)}
    href={isInactive ? undefined : href}
    {target}
    {rel}
    aria-disabled={isInactive || undefined}
    aria-busy={loading || undefined}
    tabindex={isInactive ? -1 : tabindex}
    class={cn(base, variants[variant], sizes[size], className)}
  >
    {#if loading}
      <Spinner size="sm" />
    {/if}
    {#if children}{@render children()}{/if}
  </a>
{:else}
  <button
    class={cn(base, variants[variant], sizes[size], className)}
    disabled={isInactive}
    aria-busy={loading || undefined}
    {tabindex}
    {type}
    {...rest}
  >
    {#if loading}
      <Spinner size="sm" />
    {/if}
    {#if children}{@render children()}{/if}
  </button>
{/if}
