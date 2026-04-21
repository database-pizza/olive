<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    maxHeight?: string;
    children?: Snippet;
  }

  let { class: className = '', maxHeight, children }: Props = $props();
</script>

<div
  class={cn('overflow-auto', className)}
  style:max-height={maxHeight}
>
  {#if children}{@render children()}{/if}
</div>
