<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  type Variant = 'info' | 'success' | 'warning' | 'error';

  interface Props {
    variant?: Variant;
    title?: string;
    class?: string;
    children?: Snippet;
  }

  let { variant = 'info', title, class: className = '', children }: Props = $props();

  const variantClasses: Record<Variant, string> = {
    info:    'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error:   'alert-error',
  };

  const icons: Record<Variant, string> = {
    info:    'M12 16v-4M12 8h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z',
    success: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
    warning: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
    error:   'M18 6L6 18M6 6l12 12',
  };
</script>

<div
  role="alert"
  class={cn(
    'flex gap-3 rounded-[var(--radius)] border p-4 text-sm',
    variantClasses[variant],
    className
  )}
>
  <svg class="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d={icons[variant]}/>
  </svg>
  <div class="flex-1 min-w-0">
    {#if title}
      <p class="font-medium mb-1">{title}</p>
    {/if}
    {#if children}{@render children()}{/if}
  </div>
</div>
