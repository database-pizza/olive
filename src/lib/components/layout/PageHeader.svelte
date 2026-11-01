<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    title: string;
    description?: string;
    eyebrow?: string;
    back?: string;
    backLabel?: string;
    class?: string;
    icon?: Snippet;
    actions?: Snippet;
    meta?: Snippet;
  }

  let {
    title,
    description,
    eyebrow,
    back,
    backLabel = 'Back',
    class: className = '',
    icon,
    actions,
    meta,
  }: Props = $props();
</script>

<header class={cn('mb-5 sm:mb-7', className)}>
  {#if back}
    <a
      href={back}
      class="group mb-3 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] text-xs font-medium text-[var(--muted-foreground)] outline-none transition-colors hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-transform duration-[var(--duration-fast)] group-hover:-translate-x-0.5"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      {backLabel}
    </a>
  {/if}

  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div class="flex min-w-0 items-start gap-3">
      {#if icon}
        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)] [&_svg]:size-4"
        >
          {@render icon()}
        </div>
      {/if}
      <div class="min-w-0">
        {#if eyebrow}
          <p class="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--subtle-foreground)]">
            {eyebrow}
          </p>
        {/if}
        <h1
          class="text-[22px] font-semibold leading-tight tracking-[-0.028em] text-[var(--foreground)] sm:text-[26px]"
        >
          {title}
        </h1>
        {#if description}
          <p class="mt-1 max-w-prose text-[13px] leading-relaxed text-[var(--muted-foreground)] sm:text-sm">
            {description}
          </p>
        {/if}
        {#if meta}
          <div class="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
            {@render meta()}
          </div>
        {/if}
      </div>
    </div>

    {#if actions}
      <div
        class="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:justify-end"
      >
        {@render actions()}
      </div>
    {/if}
  </div>
</header>
