<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    href?: string;
    label: string;
    active?: boolean;
    collapsed?: boolean;
    badge?: string | number;
    class?: string;
    icon?: Snippet;
    onclick?: () => void;
  }

  let {
    href,
    label,
    active = false,
    collapsed = false,
    badge,
    class: className = '',
    icon,
    onclick,
  }: Props = $props();
</script>

{#if href}
  <a
    {href}
    aria-current={active ? 'page' : undefined}
    title={collapsed ? label : undefined}
    class={cn(
      'group relative flex items-center gap-3 rounded-[var(--radius)] px-2.5 py-2 text-sm font-medium',
      'transition-colors duration-[150ms]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
      collapsed ? 'justify-center' : '',
      active
        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]',
      className
    )}
  >
    {#if icon}
      <span class="flex h-4 w-4 shrink-0 items-center justify-center">{@render icon()}</span>
    {/if}
    {#if !collapsed}
      <span class="flex-1 truncate">{label}</span>
      {#if badge !== undefined}
        <span class={cn(
          'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
          active ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
        )}>{badge}</span>
      {/if}
    {/if}
    {#if collapsed && badge !== undefined}
      <span class="absolute right-1 top-1 flex h-2 w-2 items-center justify-center rounded-full bg-[var(--primary)]"></span>
    {/if}
  </a>
{:else}
  <button
    type="button"
    {onclick}
    title={collapsed ? label : undefined}
    class={cn(
      'group relative flex w-full items-center gap-3 rounded-[var(--radius)] px-2.5 py-2 text-sm font-medium',
      'cursor-pointer transition-colors duration-[150ms]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
      collapsed ? 'justify-center' : '',
      active
        ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
        : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]',
      className
    )}
  >
    {#if icon}
      <span class="flex h-4 w-4 shrink-0 items-center justify-center">{@render icon()}</span>
    {/if}
    {#if !collapsed}
      <span class="flex-1 truncate text-left">{label}</span>
      {#if badge !== undefined}
        <span class={cn(
          'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
          active ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
        )}>{badge}</span>
      {/if}
    {/if}
    {#if collapsed && badge !== undefined}
      <span class="absolute right-1 top-1 flex h-2 w-2 items-center justify-center rounded-full bg-[var(--primary)]"></span>
    {/if}
  </button>
{/if}
