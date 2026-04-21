<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    id?: string;
    class?: string;
    onchange?: (checked: boolean) => void;
  }

  let {
    checked = $bindable(false),
    indeterminate = false,
    disabled = false,
    id,
    class: className = '',
    onchange,
  }: Props = $props();

  function handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    checked = input.checked;
    onchange?.(checked);
  }
</script>

<label
  class={cn(
    'relative inline-flex items-center justify-center',
    disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
    className
  )}
>
  <input
    type="checkbox"
    {id}
    {disabled}
    bind:checked
    bind:indeterminate
    onchange={handleChange}
    class="sr-only peer"
  />
  <div
    class={cn(
      'h-4 w-4 rounded-[3px] border',
      'flex items-center justify-center overflow-hidden',
      'transition-colors duration-[100ms]',
      'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--background)]',
      checked || indeterminate
        ? 'bg-[var(--primary)] border-[var(--primary)]'
        : 'bg-transparent border-[var(--border)]',
    )}
  >
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      class={cn(
        'transition-[transform,opacity] duration-[100ms]',
        checked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      )}
    >
      {#if indeterminate}
        <path d="M1 4H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      {:else}
        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      {/if}
    </svg>
  </div>
</label>
