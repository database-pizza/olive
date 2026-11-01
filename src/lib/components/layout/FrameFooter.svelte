<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<footer class={cn('flex items-center gap-2 px-4 py-3 sm:px-5', className)}>
  {#if children}{@render children()}{/if}
</footer>
