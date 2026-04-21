<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Crumb {
    label: string;
    href?: string;
  }

  interface Props {
    items: Crumb[];
    class?: string;
  }

  let { items, class: className = '' }: Props = $props();

  const textBase = 'text-sm leading-none';
</script>

<nav aria-label="Breadcrumb" class={cn('flex items-baseline gap-0', className)}>
  {#each items as crumb, i}
    {#if i > 0}
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        class="shrink-0 self-center text-[var(--muted-foreground)] opacity-30"
      >
        <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    {/if}

    {#if crumb.href && i < items.length - 1}
      <a
        href={crumb.href}
        class={cn(
          textBase,
          'px-1 rounded cursor-pointer',
          'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
          'transition-colors duration-[150ms]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]'
        )}
      >{crumb.label}</a>
    {:else}
      <span
        aria-current={i === items.length - 1 ? 'page' : undefined}
        class={cn(
          textBase,
          'px-1',
          i === items.length - 1
            ? 'text-[var(--foreground)] font-medium'
            : 'text-[var(--muted-foreground)]'
        )}
      >{crumb.label}</span>
    {/if}
  {/each}
</nav>
