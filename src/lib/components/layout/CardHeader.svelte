<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  interface Props {
    class?: string;
    /** Show a hairline under the header when the card has a body. */
    divided?: boolean;
    children?: Snippet;
  }
  let { class: className = '', divided = false, children }: Props = $props();
</script>

<div
  class={cn(
    'flex flex-col gap-1 px-4 pt-4 sm:px-5 sm:pt-5',
    divided && 'border-b border-[var(--border)] pb-4',
    className,
  )}
>
  {#if children}{@render children()}{/if}
</div>
