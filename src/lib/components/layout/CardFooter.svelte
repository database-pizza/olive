<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  interface Props { class?: string; children?: Snippet; }
  let { class: className = '', children }: Props = $props();
</script>
<div class={cn('flex items-center px-5 pb-5 pt-0', className)}>
  {#if children}{@render children()}{/if}
</div>
