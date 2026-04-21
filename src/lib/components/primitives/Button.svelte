<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils/cn.js';

  type Variant = 'default' | 'outline' | 'ghost' | 'destructive' | 'link';
  type Size = 'sm' | 'md' | 'lg' | 'icon';

  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    size?: Size;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = 'default',
    size = 'md',
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const base = [
    'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap',
    'transition-all duration-[150ms]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
    'cursor-pointer disabled:pointer-events-none disabled:opacity-40',
    'select-none',
  ].join(' ');

  const variants: Record<Variant, string> = {
    default:     'btn-default bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 active:bg-[var(--primary)]/80',
    outline:     'btn-outline border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] active:bg-[var(--muted)]/80',
    ghost:       'bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] active:bg-[var(--muted)]/80',
    destructive: 'btn-destructive bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90 active:bg-[var(--destructive)]/80',
    link:        'bg-transparent text-[var(--primary)] underline-offset-4 hover:underline h-auto',
  };

  const sizes: Record<Size, string> = {
    sm:   'h-7 rounded-[var(--radius-button)] px-2.5 text-xs',
    md:   'h-8 rounded-[var(--radius-button)] px-3.5 text-sm',
    lg:   'h-10 rounded-[var(--radius-button)] px-5 text-sm',
    icon: 'h-8 w-8 rounded-[var(--radius-button)]',
  };
</script>

<button
  class={cn(base, variants[variant], sizes[size], className)}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  /* Primary — depth via top inner highlight + bottom shadow */
  :global(.btn-default) {
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.16);
  }
  :global(.btn-default:hover) {
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.16);
  }
  :global(.btn-default:active) {
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.18);
  }

  /* Outline — subtle lift */
  :global(.btn-outline) {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  }
  :global(.btn-outline:active) {
    box-shadow: none;
  }

  /* Destructive — same depth pattern as default */
  :global(.btn-destructive) {
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }
  :global(.btn-destructive:hover) {
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }
  :global(.btn-destructive:active) {
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  /* Disabled — flat, no shadow regardless of variant */
  :global(.btn-default:disabled),
  :global(.btn-outline:disabled),
  :global(.btn-destructive:disabled) {
    box-shadow: none;
  }
</style>
