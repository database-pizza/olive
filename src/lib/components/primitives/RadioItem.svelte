<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { getContext } from 'svelte';

  interface RadioGroupContext {
    value: string;
    name: string;
    disabled: boolean;
    select: (v: string) => void;
  }

  interface Props {
    value: string;
    disabled?: boolean;
    id?: string;
    class?: string;
    children?: Snippet;
  }

  let { value, disabled: localDisabled = false, id, class: className = '', children }: Props = $props();

  const ctx = getContext<RadioGroupContext>('radio-group');

  let checked = $derived(ctx.value === value);
  let isDisabled = $derived(ctx.disabled || localDisabled);
</script>

<label
  class={cn(
    'flex items-center gap-2 cursor-pointer',
    isDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
    className
  )}
>
  <input
    type="radio"
    {id}
    name={ctx.name}
    {value}
    {checked}
    disabled={isDisabled}
    onchange={() => ctx.select(value)}
    class="sr-only peer"
  />
  <div
    class={cn(
      'h-4 w-4 rounded-full border border-[var(--border)]',
      'flex items-center justify-center',
      'transition-all duration-[150ms]',
      'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--background)]',
      checked ? 'border-[var(--primary)]' : '',
    )}
  >
    {#if checked}
      <div class="h-2 w-2 rounded-full bg-[var(--primary)]"></div>
    {/if}
  </div>
  {#if children}
    <span class="text-sm text-[var(--foreground)]">{@render children()}</span>
  {/if}
</label>
