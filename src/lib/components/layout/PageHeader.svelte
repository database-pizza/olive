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

<div class={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8', className)}>
  <div class="flex flex-col gap-1">
    <h1 class="text-2xl font-semibold text-[var(--foreground)] leading-tight">{title}</h1>
    {#if description}
      <p class="text-sm text-[var(--muted-foreground)]">{description}</p>
    {/if}
  </div>
  {#if actions}
    <div class="flex items-center gap-2 shrink-0">
      {@render actions()}
    </div>
  {/if}
</div>
