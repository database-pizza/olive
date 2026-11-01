<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    title: string;
    description?: string;
    class?: string;
    actions?: Snippet;
  }

  let { title, description, class: className = '', actions }: Props = $props();
</script>

<div class={cn('flex items-start justify-between gap-4', className)}>
  <div class="min-w-0">
    <h2 class="text-[13px] font-semibold text-[var(--foreground)]">{title}</h2>
    {#if description}
      <p class="mt-0.5 max-w-prose text-xs leading-relaxed text-[var(--muted-foreground)]">{description}</p>
    {/if}
  </div>
  {#if actions}
    <div class="flex shrink-0 items-center gap-2">{@render actions()}</div>
  {/if}
</div>
