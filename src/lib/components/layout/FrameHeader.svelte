<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<header class={cn('flex flex-col gap-0.5 px-4 py-3.5 sm:px-5', className)}>
  {#if children}{@render children()}{/if}
</header>
