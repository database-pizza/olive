<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  interface Props { class?: string; children?: Snippet; }
  let { class: className = '', children }: Props = $props();
</script>

<div class={cn('min-w-0 flex-1 px-4 py-4 sm:px-5', className)}>
  {#if children}{@render children()}{/if}
</div>
