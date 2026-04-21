<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  interface Props { class?: string; children?: Snippet; }
  let { class: className = '', children }: Props = $props();
</script>
<p class={cn('text-sm text-[var(--muted-foreground)]', className)}>
  {#if children}{@render children()}{/if}
</p>
