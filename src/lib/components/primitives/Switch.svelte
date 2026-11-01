<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    checked?: boolean;
    disabled?: boolean;
    id?: string;
    class?: string;
    size?: 'sm' | 'md';
    'aria-label'?: string;
    onchange?: (checked: boolean) => void;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    id,
    class: className = '',
    size = 'md',
    'aria-label': ariaLabel,
    onchange,
  }: Props = $props();

  function toggle() {
    if (disabled) return;
    checked = !checked;
    onchange?.(checked);
  }

  const dims = $derived(
    size === 'sm'
      ? { track: 'h-4 w-7', thumb: 'size-3', travel: 'translate-x-3' }
      : { track: 'h-5 w-9', thumb: 'size-4', travel: 'translate-x-4' },
  );
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  aria-label={ariaLabel}
  {id}
  {disabled}
  onclick={toggle}
  class={cn(
    'group relative inline-flex shrink-0 cursor-pointer items-center rounded-full',
    'border border-transparent p-0.5 outline-none',
    'transition-[background-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-move)]',
    'focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
    'disabled:cursor-not-allowed disabled:opacity-45',
    dims.track,
    checked ? 'bg-[var(--brand)]' : 'bg-[var(--border-strong)]',
    className,
  )}
>
  <span
    class={cn(
      'pointer-events-none relative z-10 rounded-full bg-white',
      'shadow-[0_1px_2px_oklch(0.2_0.01_100/0.3),0_0_0_0.5px_oklch(0.2_0.01_100/0.08)]',
      'transition-[transform,width] duration-[var(--duration-base)] ease-[var(--ease-spring)]',
      dims.thumb,
      checked ? dims.travel : 'translate-x-0',
      'group-active:w-[calc(100%-0.25rem)]',
      checked && 'group-active:translate-x-0.5',
    )}
  ></span>
</button>
