<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  interface Props { class?: string; children?: Snippet; }
  let { class: className = '', children }: Props = $props();
</script>
<h3 class={cn('text-base font-semibold leading-tight text-[var(--card-foreground)]', className)}>
  {#if children}{@render children()}{/if}
</h3>
