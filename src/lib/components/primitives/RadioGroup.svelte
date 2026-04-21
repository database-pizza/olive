<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { setContext } from 'svelte';

  interface Props {
    value?: string;
    name?: string;
    disabled?: boolean;
    orientation?: 'horizontal' | 'vertical';
    class?: string;
    children?: Snippet;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    name = '',
    disabled = false,
    orientation = 'vertical',
    class: className = '',
    children,
    onchange,
  }: Props = $props();

  setContext('radio-group', {
    get value() { return value; },
    get name() { return name; },
    get disabled() { return disabled; },
    select: (v: string) => {
      value = v;
      onchange?.(v);
    },
  });
</script>

<div
  role="radiogroup"
  class={cn(
    'flex gap-2',
    orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
    className
  )}
>
  {#if children}{@render children()}{/if}
</div>
