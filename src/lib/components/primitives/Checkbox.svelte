<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    id?: string;
    class?: string;
    'aria-label'?: string;
    onchange?: (checked: boolean) => void;
  }

  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    disabled = false,
    id,
    class: className = '',
    'aria-label': ariaLabel,
    onchange,
  }: Props = $props();

  let input: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (input) input.indeterminate = indeterminate;
  });

  function handleChange() {
    if (!input) return;
    checked = input.checked;
    indeterminate = false;
    onchange?.(checked);
  }
</script>

<label
  class={cn(
    'group relative inline-flex size-4 shrink-0 items-center justify-center',
    disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer',
    className,
  )}
>
  <input
    bind:this={input}
    type="checkbox"
    {id}
    {disabled}
    {checked}
    aria-label={ariaLabel}
    aria-checked={indeterminate ? 'mixed' : checked}
    onchange={handleChange}
    class="peer sr-only"
  />
  <span
    aria-hidden="true"
    class={cn(
      'relative flex size-4 items-center justify-center overflow-hidden rounded-[5px] border',
      'shadow-[var(--olive-inset-highlight)]',
      'transition-[background-color,border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-move)]',
      'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--background)]',
      'group-hover:border-[var(--border-strong)]',
      checked || indeterminate
        ? 'border-[var(--brand-strong)] bg-[var(--brand)] text-[var(--brand-foreground)] group-hover:border-[var(--brand-strong)]'
        : 'border-[var(--input)] bg-[var(--card)]',
    )}
  >
    <svg
      viewBox="0 0 12 10"
      fill="none"
      class={cn(
        'relative z-10 size-2.5 transition-[opacity,transform] duration-[var(--duration-fast)] ease-[var(--ease-spring)]',
        checked || indeterminate ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
      )}
      aria-hidden="true"
    >
      {#if indeterminate}
        <path d="M2 5h8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
      {:else}
        <path
          d="M1.5 5.2 4.4 8 10.5 2"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="13"
          style:animation={checked ? 'olive-draw-check 220ms var(--olive-ease-enter) both' : 'none'}
        />
      {/if}
    </svg>
  </span>
</label>
