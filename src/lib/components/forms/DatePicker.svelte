<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    value?: Date | null;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    min?: Date;
    max?: Date;
    class?: string;
    onchange?: (date: Date | null) => void;
  }

  let {
    value = $bindable(null),
    placeholder = 'Pick a date…',
    disabled = false,
    error = false,
    min,
    max,
    class: className = '',
    onchange,
  }: Props = $props();

  let open = $state(false);
  let containerEl = $state<HTMLElement | null>(null);

  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let cursor = $state(() => {
    const d = value ?? new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  let viewYear = $state(cursor().year);
  let viewMonth = $state(cursor().month);

  function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
  function firstWeekday(y: number, m: number) { return new Date(y, m, 1).getDay(); }

  let cells = $derived.by(() => {
    const total = daysInMonth(viewYear, viewMonth);
    const offset = firstWeekday(viewYear, viewMonth);
    return Array.from({ length: offset + total }, (_, i) => i < offset ? null : i - offset + 1);
  });

  function isSelected(day: number) {
    if (!value) return false;
    return value.getFullYear() === viewYear && value.getMonth() === viewMonth && value.getDate() === day;
  }

  function isToday(day: number) {
    const t = new Date();
    return t.getFullYear() === viewYear && t.getMonth() === viewMonth && t.getDate() === day;
  }

  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return true;
    if (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return true;
    return false;
  }

  function selectDay(day: number) {
    if (isDisabled(day)) return;
    value = new Date(viewYear, viewMonth, day);
    open = false;
    onchange?.(value);
  }

  function prevMonth() {
    if (viewMonth === 0) { viewMonth = 11; viewYear--; }
    else viewMonth--;
  }

  function nextMonth() {
    if (viewMonth === 11) { viewMonth = 0; viewYear++; }
    else viewMonth++;
  }

  function handleOutside(e: MouseEvent) {
    if (containerEl && !containerEl.contains(e.target as Node)) { open = false; }
  }

  $effect(() => {
    if (open) {
      document.addEventListener('click', handleOutside);
      return () => document.removeEventListener('click', handleOutside);
    }
  });

  let displayValue = $derived(
    value
      ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : ''
  );
</script>

<div class={cn('relative', className)} bind:this={containerEl}>
  <button
    type="button"
    {disabled}
    onclick={() => { if (!disabled) open = !open; }}
    class={cn(
      'flex h-9 w-full items-center gap-2 rounded-[var(--radius)] border bg-transparent px-3 text-sm',
      'transition-colors duration-[150ms]',
      error ? 'border-[var(--destructive)]' : 'border-[var(--border)]',
      open && 'ring-2 ring-[var(--ring)]',
      disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      displayValue ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'
    )}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="shrink-0 text-[var(--muted-foreground)]">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
    <span class="flex-1 text-left">{displayValue || placeholder}</span>
  </button>
  {#if value}
    <button
      type="button"
      onclick={(e) => { e.stopPropagation(); value = null; onchange?.(null); }}
      class="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      aria-label="Clear date"
    >
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
  {/if}

  {#if open}
    <div
      class={cn(
        'absolute top-full z-50 mt-1',
        'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
        'shadow-[var(--shadow-md)] p-3 w-[280px]',
        'animate-[popoverIn_150ms_cubic-bezier(0.16,1,0.3,1)]'
      )}
    >
      <!-- Header -->
      <div class="mb-3 flex items-center justify-between">
        <button
          type="button"
          onclick={prevMonth}
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[var(--radius-button)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span class="text-sm font-medium text-[var(--foreground)]">{MONTHS[viewMonth]} {viewYear}</span>
        <button
          type="button"
          onclick={nextMonth}
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[var(--radius-button)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <!-- Day names -->
      <div class="mb-1 grid grid-cols-7">
        {#each DAYS as d}
          <div class="flex h-7 items-center justify-center text-xs font-medium text-[var(--muted-foreground)]">{d}</div>
        {/each}
      </div>

      <!-- Day cells -->
      <div class="grid grid-cols-7 gap-y-0.5">
        {#each cells as day}
          {#if day === null}
            <div></div>
          {:else}
            {@const sel = isSelected(day)}
            {@const tod = isToday(day)}
            {@const dis = isDisabled(day)}
            <button
              type="button"
              onclick={() => selectDay(day)}
              disabled={dis}
              class={cn(
                'flex h-8 w-full items-center justify-center rounded-[var(--radius-button)] text-sm transition-colors duration-[100ms]',
                sel
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-medium'
                  : tod
                    ? 'border border-[var(--primary)] text-[var(--primary)] font-medium hover:bg-[var(--primary)]/10'
                    : 'text-[var(--foreground)] hover:bg-[var(--muted)]',
                dis && 'opacity-30 cursor-not-allowed',
                !dis && !sel && 'cursor-pointer'
              )}
            >
              {day}
            </button>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes popoverIn {
    from { opacity: 0; transform: scale(0.97) translateY(-4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
</style>
