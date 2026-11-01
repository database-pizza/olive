<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<div
  class={cn(
    'relative rounded-[calc(var(--radius-2xl)-5px)] border border-[var(--border)]',
    'bg-[var(--card)] shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)]',
    className,
  )}
>
  {#if children}{@render children()}{/if}
</div>
