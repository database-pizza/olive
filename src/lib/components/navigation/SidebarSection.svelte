<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    label?: string;
    collapsed?: boolean;
    class?: string;
    children?: Snippet;
  }

  let { label, collapsed = false, class: className = '', children }: Props = $props();
</script>

<div class={cn('flex flex-col gap-0.5', className)}>
  {#if label && !collapsed}
    <p class="mb-1 mt-2 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]/60 first:mt-0">
      {label}
    </p>
  {:else if label && collapsed}
    <div class="my-2 mx-auto h-px w-6 bg-[var(--border)] first:mt-0"></div>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</div>
