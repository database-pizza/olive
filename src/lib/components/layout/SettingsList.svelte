<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    title?: string;
    description?: string;
    class?: string;
    children?: Snippet;
  }

  let { title, description, class: className = '', children }: Props = $props();
</script>

<section class={cn('flex flex-col gap-2', className)}>
  {#if title}
    <div class="px-1">
      <h2 class="text-[13px] font-semibold text-[var(--foreground)]">{title}</h2>
      {#if description}
        <p class="mt-0.5 text-xs text-[var(--muted-foreground)]">{description}</p>
      {/if}
    </div>
  {/if}
  <div
    class="divide-y divide-[var(--border)] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)]"
  >
    {#if children}{@render children()}{/if}
  </div>
</section>
