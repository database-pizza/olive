<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    checked?: boolean;
    disabled?: boolean;
    id?: string;
    class?: string;
    onchange?: (checked: boolean) => void;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    id,
    class: className = '',
    onchange,
  }: Props = $props();

  function toggle() {
    if (disabled) return;
    checked = !checked;
    onchange?.(checked);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  {id}
  {disabled}
  onclick={toggle}
  onkeydown={handleKeydown}
  class={cn(
    'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center',
    'rounded-[9999px] border-2 border-transparent',
    'transition-colors duration-[200ms]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
    'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
    checked ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]',
    className
  )}
  aria-label={id ? undefined : 'Toggle'}
>
  <span
    class={cn(
      'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm',
      'transition-transform duration-[200ms]',
      checked ? 'translate-x-4' : 'translate-x-0'
    )}
  ></span>
</button>
