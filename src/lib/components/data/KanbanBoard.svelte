<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<div class={cn('flex gap-4 overflow-x-auto pb-4', className)}>
  {#if children}
    {@render children()}
  {/if}
</div>
