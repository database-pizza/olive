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

  let {
    value,
    disabled: localDisabled = false,
    id,
    class: className = '',
    children,
  }: Props = $props();

  const ctx = getContext<RadioGroupContext>('radio-group');
  const checked = $derived(ctx.value === value);
  const isDisabled = $derived(ctx.disabled || localDisabled);
</script>

<label
  class={cn(
    'flex items-center gap-2.5 text-[13px] text-[var(--foreground)]',
    isDisabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer',
    className,
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
    class="peer sr-only"
  />
  <span
    aria-hidden="true"
    class={cn(
      'flex size-4 shrink-0 items-center justify-center rounded-full border bg-[var(--card)]',
      'shadow-[var(--olive-inset-highlight)] transition-[border-color,box-shadow] duration-[var(--duration-fast)]',
      'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--background)]',
      checked
        ? 'border-[var(--brand-strong)] shadow-[0_0_0_3px_var(--brand-soft)]'
        : 'border-[var(--input)] hover:border-[var(--border-strong)]',
    )}
  >
    <span
      class={cn(
        'size-1.5 rounded-full bg-[var(--brand-strong)] transition-transform duration-[var(--duration-fast)] ease-[var(--ease-spring)]',
        checked ? 'scale-100' : 'scale-0',
      )}
    ></span>
  </span>
  {#if children}
    <span>{@render children()}</span>
  {/if}
</label>
