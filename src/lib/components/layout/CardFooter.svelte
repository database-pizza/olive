<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  interface Props { class?: string; divided?: boolean; children?: Snippet; }
  let { class: className = '', divided = false, children }: Props = $props();
</script>

<div
  class={cn(
    'flex items-center gap-2 px-4 pb-4 pt-3 sm:px-5 sm:pb-5',
    divided && 'border-t border-[var(--border)] pt-4',
    className,
  )}
>
  {#if children}{@render children()}{/if}
</div>
