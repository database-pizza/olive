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
    onchange,
  }: Props = $props();

  let dragging = $state(false);
  let percent = $derived(((value - min) / (max - min)) * 100);
</script>

<div class={cn('relative flex w-full touch-none select-none items-center h-5', className)}>
  <!-- Track -->
  <div class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[var(--muted)]">
    <!-- Fill — no transition, must track pointer instantly -->
    <div
      class="absolute h-full bg-[var(--primary)]"
      style:width="{percent}%"
    ></div>
  </div>

  <!-- Native input — invisible, drives the value -->
  <input
    type="range"
    {id}
    {min}
    {max}
    {step}
    {disabled}
    bind:value
    oninput={() => onchange?.(value)}
    onpointerdown={() => { dragging = true; }}
    onpointerup={() => { dragging = false; }}
    class={cn(
      'absolute inset-0 h-full w-full opacity-0',
      disabled ? 'cursor-not-allowed' : 'cursor-pointer'
    )}
  />

  <!-- Visual thumb — position is immediate, only scale animates on drag -->
  <div
    class={cn(
      'pointer-events-none absolute h-4 w-4 rounded-full',
      'border-2 border-[var(--primary)] bg-[var(--background)]',
      'shadow-[0_1px_3px_rgba(0,0,0,0.2)]',
      'transition-transform duration-[100ms]',
      dragging ? 'scale-125' : 'scale-100',
      disabled && 'opacity-40'
    )}
    style:left="calc({percent}% - 8px)"
  ></div>
</div>
