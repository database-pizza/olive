<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className = '', children }: Props = $props();
</script>

<!-- A framed stack: a quiet gutter that groups panels without nesting cards. -->
<div class={cn('flex flex-col rounded-[var(--radius-2xl)] bg-[var(--muted)] p-1', className)}>
  {#if children}{@render children()}{/if}
</div>
