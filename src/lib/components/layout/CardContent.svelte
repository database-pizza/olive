<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  interface Props { class?: string; children?: Snippet; }
  let { class: className = '', children }: Props = $props();
</script>
<div class={cn('px-5 py-4', className)}>
  {#if children}{@render children()}{/if}
</div>
