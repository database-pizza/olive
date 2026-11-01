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
</script>

<nav aria-label="Breadcrumb" class={cn('min-w-0', className)}>
  <ol class="flex items-center gap-0.5">
    {#each items as crumb, i}
      <li class="flex min-w-0 items-center gap-0.5">
        {#if i > 0}
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            class="shrink-0 text-[var(--subtle-foreground)]"
          >
            <path
              d="M6 3.5 10.5 8 6 12.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        {/if}

        {#if crumb.href && i < items.length - 1}
          <a
            href={crumb.href}
            class="max-w-[12rem] truncate rounded-[var(--radius-xs)] px-1 py-0.5 text-xs text-[var(--muted-foreground)] outline-none transition-colors hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {crumb.label}
          </a>
        {:else}
          <span
            aria-current={i === items.length - 1 ? 'page' : undefined}
            class={cn(
              'max-w-[16rem] truncate px-1 py-0.5 text-xs',
              i === items.length - 1
                ? 'font-medium text-[var(--foreground)]'
                : 'text-[var(--muted-foreground)]',
            )}
          >
            {crumb.label}
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
