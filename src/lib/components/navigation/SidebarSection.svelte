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
    <p class="mb-0.5 mt-3 px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--subtle-foreground)] first:mt-1">
      {label}
    </p>
  {:else if label && collapsed}
    <div class="mx-auto my-2 h-px w-5 bg-[var(--sidebar-border)] first:mt-1"></div>
  {/if}
  {#if children}{@render children()}{/if}
</div>
