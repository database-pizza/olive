<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    title: string;
    description?: string;
    class?: string;
    icon?: Snippet;
    actions?: Snippet;
  }

  let { title, description, class: className = '', icon, actions }: Props = $props();
</script>

<div class={cn('flex flex-col items-center justify-center gap-4 py-16 px-6 text-center', className)}>
  {#if icon}
    <div class="flex h-12 w-12 items-center justify-center rounded-[var(--radius)] bg-[var(--muted)] text-[var(--muted-foreground)]">
      {@render icon()}
    </div>
  {/if}
  <div class="flex flex-col gap-1.5 max-w-sm">
    <h3 class="text-base font-semibold text-[var(--foreground)]">{title}</h3>
    {#if description}
      <p class="text-sm text-[var(--muted-foreground)]">{description}</p>
    {/if}
  </div>
  {#if actions}
    <div class="flex items-center gap-2 mt-2">
      {@render actions()}
    </div>
  {/if}
</div>
