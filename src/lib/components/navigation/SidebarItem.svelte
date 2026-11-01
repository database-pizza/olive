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
    external?: boolean;
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
    external = false,
  }: Props = $props();

  const itemClass = $derived(cn(
    'group relative flex h-8 w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2',
    'text-[13px] font-medium outline-none transition-[background-color,color,box-shadow]',
    'duration-[var(--duration-fast)] ease-[var(--ease-move)]',
    'focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--sidebar)]',
    collapsed && 'justify-center px-0',
    active
      ? 'bg-[var(--brand-soft)] text-[var(--foreground)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--brand)_18%,transparent)]'
      : 'text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--foreground)]',
    className,
  ));

  const iconClass = $derived(cn(
    'flex size-4 shrink-0 items-center justify-center [&_svg]:size-4',
    active ? 'text-[var(--brand-strong)] dark:text-[var(--brand)]' : 'opacity-80',
  ));
</script>

{#if href}
  <a
    {href}
    aria-current={active ? 'page' : undefined}
    title={collapsed ? label : undefined}
    target={external ? '_blank' : undefined}
    rel={external ? 'noreferrer' : undefined}
    class={itemClass}
  >
    {#if icon}
      <span class={iconClass}>{@render icon()}</span>
    {/if}
    {#if !collapsed}
      <span class="min-w-0 flex-1 truncate">{label}</span>
      {#if badge !== undefined}
        <span
          class={cn(
            'olive-tnum flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
            active
              ? 'bg-[var(--brand)]/18 text-[var(--brand-strong)] dark:text-[var(--brand)]'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)]',
          )}
        >
          {badge}
        </span>
      {/if}
    {:else if badge !== undefined}
      <span
        class="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--brand)]"
        aria-hidden="true"
      ></span>
    {/if}
  </a>
{:else}
  <button
    type="button"
    {onclick}
    title={collapsed ? label : undefined}
    aria-current={active ? 'page' : undefined}
    class={itemClass}
  >
    {#if icon}
      <span class={iconClass}>{@render icon()}</span>
    {/if}
    {#if !collapsed}
      <span class="min-w-0 flex-1 truncate text-left">{label}</span>
      {#if badge !== undefined}
        <span
          class={cn(
            'olive-tnum flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
            active
              ? 'bg-[var(--brand)]/18 text-[var(--brand-strong)] dark:text-[var(--brand)]'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)]',
          )}
        >
          {badge}
        </span>
      {/if}
    {:else if badge !== undefined}
      <span
        class="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--brand)]"
        aria-hidden="true"
      ></span>
    {/if}
  </button>
{/if}
