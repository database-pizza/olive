<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  interface Props { class?: string; children?: Snippet; }
  let { class: className = '', children }: Props = $props();
</script>
<div class={cn('min-h-dvh bg-[var(--background)]', className)}>
  <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
    {#if children}{@render children()}{/if}
  </div>
</div>
