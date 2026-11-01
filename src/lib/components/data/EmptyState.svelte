<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    title: string;
    description?: string;
    class?: string;
    icon?: Snippet;
    actions?: Snippet;
    secondary?: Snippet;
    compact?: boolean;
    grid?: boolean;
  }

  let {
    title,
    description,
    class: className = '',
    icon,
    actions,
    secondary,
    compact = false,
    grid = false,
  }: Props = $props();
</script>

<div
  class={cn(
    'flex min-w-0 flex-1 flex-col items-center justify-center rounded-[var(--radius-xl)] text-center',
    compact ? 'gap-3 px-5 py-8' : 'gap-5 px-6 py-14',
    grid && 'olive-drafting-grid border border-dashed border-[var(--border)] bg-[var(--card)]/40',
    className,
  )}
>
  {#if icon}
    <div class="relative mb-1" aria-hidden="true">
      <span
        class="absolute left-0 top-1 size-10 -translate-x-2 -rotate-[10deg] rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--olive-shadow-xs)]"
      ></span>
      <span
        class="absolute right-0 top-1 size-10 translate-x-2 rotate-[10deg] rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--olive-shadow-xs)]"
      ></span>
      <span
        class="relative flex size-11 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] shadow-[var(--olive-shadow-sm),var(--olive-inset-highlight)] [&_svg]:size-5"
      >
        {@render icon()}
      </span>
    </div>
  {/if}

  <div class="flex max-w-sm flex-col items-center gap-1.5">
    <h3 class={cn('font-semibold tracking-[-0.015em] text-[var(--foreground)]', compact ? 'text-[14px]' : 'text-[15px]')}>
      {title}
    </h3>
    {#if description}
      <p class="text-[13px] leading-relaxed text-[var(--muted-foreground)]">{description}</p>
    {/if}
  </div>

  {#if actions || secondary}
    <div class="flex flex-col items-center gap-2">
      {#if actions}
        <div class="flex flex-wrap items-center justify-center gap-2">{@render actions()}</div>
      {/if}
      {#if secondary}
        <div class="text-xs text-[var(--muted-foreground)]">{@render secondary()}</div>
      {/if}
    </div>
  {/if}
</div>
