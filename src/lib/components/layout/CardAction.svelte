<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  interface Props { class?: string; children?: Snippet; }
  let { class: className = '', children }: Props = $props();
</script>

<div class={cn('absolute right-4 top-4 z-10 flex items-center gap-1.5', className)}>
  {#if children}{@render children()}{/if}
</div>
