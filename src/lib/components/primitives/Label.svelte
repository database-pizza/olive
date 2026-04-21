<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils/cn.js';

  interface Props extends HTMLLabelAttributes {
    class?: string;
    children?: Snippet;
  }

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<label
  class={cn(
    'text-sm font-medium text-[var(--foreground)] leading-none',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-40',
    className
  )}
  {...rest}
>
  {#if children}{@render children()}{/if}
</label>
