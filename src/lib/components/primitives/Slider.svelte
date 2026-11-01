<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    id?: string;
    class?: string;
    showValue?: boolean;
    'aria-label'?: string;
    onchange?: (value: number) => void;
  }

  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    id,
    class: className = '',
    showValue = false,
    'aria-label': ariaLabel,
    onchange,
  }: Props = $props();

  let dragging = $state(false);
  let percent = $derived(max > min ? ((value - min) / (max - min)) * 100 : 0);
</script>

<div class={cn('relative flex w-full select-none flex-col gap-2', className)}>
  {#if showValue}
    <div class="flex items-center justify-between text-xs">
      <span class="olive-tnum font-medium text-[var(--foreground)]">{value}</span>
      <span class="text-[var(--subtle-foreground)]">{max}</span>
    </div>
  {/if}
  <div
    class="group relative flex h-5 touch-none items-center"
    class:opacity-45={disabled}
  >
    <div class="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
      <div
        class="absolute inset-y-0 left-0 rounded-full bg-[var(--brand)]"
        style:width="{percent}%"
      ></div>
    </div>

    <input
      type="range"
      {id}
      {min}
      {max}
      {step}
      {disabled}
      aria-label={ariaLabel}
      bind:value
      oninput={() => onchange?.(value)}
      onpointerdown={() => {
        dragging = true;
      }}
      onpointerup={() => {
        dragging = false;
      }}
      onpointercancel={() => {
        dragging = false;
      }}
      onblur={() => {
        dragging = false;
      }}
      class={cn(
        'absolute inset-0 size-full cursor-pointer opacity-0',
        disabled && 'cursor-not-allowed',
      )}
    />

    <span
      class={cn(
        'pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 rounded-full',
        'border border-[var(--border-strong)] bg-[var(--card)]',
        'shadow-[0_1px_3px_oklch(0.2_0.01_100/0.22),var(--olive-inset-highlight)]',
        'transition-[transform,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-spring)]',
        dragging
          ? 'scale-110 shadow-[0_0_0_4px_var(--brand-soft)]'
          : 'group-hover:shadow-[0_0_0_3px_var(--brand-soft)]',
      )}
      style:left="calc({percent}% - 8px)"
    ></span>
  </div>
</div>
