<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    href: string;
    class?: string;
    exact?: boolean;
    children?: Snippet;
    icon?: Snippet;
  }

  let { href, class: className = '', exact = false, children, icon }: Props = $props();

  let isActive = $derived(
    exact ? page.url.pathname === href : page.url.pathname.startsWith(href)
  );
</script>

<a
  {href}
  aria-current={isActive ? 'page' : undefined}
  class={cn(
    'flex items-center gap-2 rounded-[var(--radius)] px-3 py-1.5 text-sm font-medium',
    'transition-colors duration-[150ms]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
    isActive
      ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]',
    className
  )}
>
  {#if icon}{@render icon()}{/if}
  {#if children}{@render children()}{/if}
</a>
