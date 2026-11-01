<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    label: string;
    description?: string;
    href?: string;
    danger?: boolean;
    disabled?: boolean;
    class?: string;
    icon?: Snippet;
    actions?: Snippet;
    children?: Snippet;
  }

  let {
    label,
    description,
    href,
    danger = false,
    disabled = false,
    class: className = '',
    icon,
    actions,
    children,
  }: Props = $props();

  const classes = $derived(cn(
    'group flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left sm:px-5',
    'transition-colors duration-[var(--duration-fast)]',
    href && !disabled && 'cursor-pointer hover:bg-[var(--accent)]',
    disabled && 'opacity-45',
    danger && 'text-[var(--destructive-foreground-soft)]',
    className,
  ));
</script>

{#if href && !disabled}
  <a {href} class={classes}>
    {#if icon}
      <span class="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--muted)] text-[var(--muted-foreground)] [&_svg]:size-4">
        {@render icon()}
      </span>
    {/if}
    <span class="min-w-0 flex-1">
      <span class="block text-[13px] font-medium text-[var(--foreground)]">{label}</span>
      {#if description}
        <span class="mt-0.5 block text-xs leading-relaxed text-[var(--muted-foreground)]">{description}</span>
      {/if}
      {#if children}{@render children()}{/if}
    </span>
    <span class="flex shrink-0 items-center gap-2">
      {#if actions}{@render actions()}{/if}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-[var(--subtle-foreground)] transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </span>
  </a>
{:else}
  <div class={classes}>
    {#if icon}
      <span class="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--muted)] text-[var(--muted-foreground)] [&_svg]:size-4">
        {@render icon()}
      </span>
    {/if}
    <div class="min-w-0 flex-1">
      <p class="text-[13px] font-medium text-[var(--foreground)]">{label}</p>
      {#if description}
        <p class="mt-0.5 text-xs leading-relaxed text-[var(--muted-foreground)]">{description}</p>
      {/if}
      {#if children}{@render children()}{/if}
    </div>
    {#if actions}
      <div class="flex shrink-0 items-center gap-2">{@render actions()}</div>
    {/if}
  </div>
{/if}
