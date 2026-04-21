<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  interface Props { class?: string; children?: Snippet; }
  let { class: className = '', children }: Props = $props();
</script>
<div class={cn('flex flex-col gap-1.5 px-5 pt-5', className)}>
  {#if children}{@render children()}{/if}
</div>
