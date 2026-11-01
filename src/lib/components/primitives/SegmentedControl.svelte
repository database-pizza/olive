<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Option {
    value: string;
    label: string;
    icon?: Snippet;
    disabled?: boolean;
  }

  interface Props {
    options: Option[];
    value?: string;
    size?: 'sm' | 'md';
    fullWidth?: boolean;
    class?: string;
    'aria-label'?: string;
    onchange?: (value: string) => void;
  }

  let {
    options,
    value = $bindable(options[0]?.value ?? ''),
    size = 'md',
    fullWidth = false,
    class: className = '',
    'aria-label': ariaLabel,
    onchange,
  }: Props = $props();

  const index = $derived(Math.max(0, options.findIndex((option) => option.value === value)));

  function select(next: string) {
    const option = options.find((candidate) => candidate.value === next);
    if (!option || option.disabled) return;
    value = next;
    onchange?.(next);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const enabled = options
      .map((option, i) => ({ option, i }))
      .filter(({ option }) => !option.disabled);
    if (enabled.length === 0) return;
    const current = enabled.findIndex(({ option }) => option.value === value);
    let next = current;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = enabled.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % enabled.length;
    else next = (current - 1 + enabled.length) % enabled.length;

    const target = enabled[next];
    select(target.option.value);
    const buttons = (event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons[target.i]?.focus();
  }
</script>

<div
  role="radiogroup"
  tabindex="0"
  aria-label={ariaLabel}
  onkeydown={handleKeydown}
  class={cn(
    'relative grid items-center rounded-[var(--radius-button)] border border-[var(--border)]',
    'bg-[var(--muted)] p-0.5',
    fullWidth && 'w-full',
    className,
  )}
  style:grid-template-columns={`repeat(${options.length}, minmax(0, 1fr))`}
>
  <span
    aria-hidden="true"
    class={cn(
      'absolute top-0.5 bottom-0.5 left-0.5 rounded-[calc(var(--radius-button)-2px)]',
      'bg-[var(--card)] shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)]',
      'transition-[transform,width] duration-[var(--duration-base)] ease-[var(--ease-spring)]',
      'w-[calc((100%-0.25rem)/var(--segment-count))]',
    )}
    style:--segment-count={options.length}
    style:transform={`translateX(calc(${index} * 100%))`}
  ></span>

  {#each options as option (option.value)}
    <button
      type="button"
      role="radio"
      aria-checked={value === option.value}
      tabindex={value === option.value ? 0 : -1}
      disabled={option.disabled}
      onclick={() => select(option.value)}
      class={cn(
        'relative z-10 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[calc(var(--radius-button)-2px)]',
        'font-medium outline-none transition-colors duration-[var(--duration-fast)]',
        'focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1',
        'focus-visible:ring-offset-[var(--background)]',
        'disabled:cursor-not-allowed disabled:opacity-40',
        size === 'sm' ? 'h-6 px-2.5 text-[11px]' : 'h-7 px-3 text-xs',
        value === option.value
          ? 'text-[var(--foreground)]'
          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
      )}
    >
      {#if option.icon}{@render option.icon()}{/if}
      {option.label}
    </button>
  {/each}
</div>
