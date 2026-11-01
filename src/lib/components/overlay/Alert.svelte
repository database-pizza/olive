<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  type Variant = 'info' | 'success' | 'warning' | 'error';

  interface Props {
    variant?: Variant;
    title?: string;
    class?: string;
    children?: Snippet;
    actions?: Snippet;
  }

  let { variant = 'info', title, class: className = '', children, actions }: Props = $props();

  const variantClasses: Record<Variant, string> = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  };

  const icons: Record<Variant, string> = {
    info: 'M12 16v-4M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    success: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
    warning: 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z M12 9v4M12 17h.01',
    error: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M15 9l-6 6M9 9l6 6',
  };
</script>

<div role="alert" class={cn('flex gap-3 rounded-[var(--radius-lg)] border p-3.5 text-[13px]', variantClasses[variant], className)}>
  <svg
    class="mt-px size-4 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d={icons[variant]} />
  </svg>
  <div class="min-w-0 flex-1">
    {#if title}
      <p class="font-semibold">{title}</p>
    {/if}
    {#if children}
      <div class={cn('leading-relaxed', title && 'mt-0.5 opacity-90')}>{@render children()}</div>
    {/if}
    {#if actions}
      <div class="mt-2.5 flex items-center gap-2">{@render actions()}</div>
    {/if}
  </div>
</div>
