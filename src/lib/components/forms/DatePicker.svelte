<script lang="ts">
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { formFieldContext, type FormFieldContext } from '$lib/utils/form-field.js';

  interface Props {
    value?: Date | null;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
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
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    min,
    max,
    class: className = '',
    onchange,
  }: Props = $props();
  const field = getContext<FormFieldContext | undefined>(formFieldContext);
  const componentId = $props.id();
  const dialogId = `${componentId}-dialog`;
  let controlId = $derived(id ?? field?.controlId ?? `${componentId}-control`);

  let open = $state(false);
  let containerEl = $state<HTMLElement | null>(null);
  let triggerEl = $state<HTMLButtonElement | null>(null);
  let dialogEl = $state<HTMLElement | null>(null);

  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let viewYear = $state(new Date().getFullYear());
  let viewMonth = $state(new Date().getMonth());

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
    queueMicrotask(() => triggerEl?.focus());
  }

  function prevMonth() {
    if (viewMonth === 0) { viewMonth = 11; viewYear--; }
    else viewMonth--;
  }

  function nextMonth() {
    if (viewMonth === 11) { viewMonth = 0; viewYear++; }
    else viewMonth++;
  }

  function dateLabel(day: number) {
    return new Date(viewYear, viewMonth, day).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function dateKey(year: number, month: number, day: number) {
    return `${year}-${month + 1}-${day}`;
  }

  let focusableDay = $derived.by(() => {
    if (value && value.getFullYear() === viewYear && value.getMonth() === viewMonth && !isDisabled(value.getDate())) {
      return value.getDate();
    }
    const today = new Date();
    if (today.getFullYear() === viewYear && today.getMonth() === viewMonth && !isDisabled(today.getDate())) {
      return today.getDate();
    }
    return Array.from({ length: daysInMonth(viewYear, viewMonth) }, (_, index) => index + 1)
      .find(day => !isDisabled(day)) ?? -1;
  });

  function focusDate(date: Date) {
    viewYear = date.getFullYear();
    viewMonth = date.getMonth();
    queueMicrotask(() => {
      dialogEl?.querySelector<HTMLElement>(`[data-date="${dateKey(date.getFullYear(), date.getMonth(), date.getDate())}"]`)?.focus();
    });
  }

  function handleDayKeydown(event: KeyboardEvent, day: number) {
    let offset = 0;
    if (event.key === 'ArrowLeft') offset = -1;
    else if (event.key === 'ArrowRight') offset = 1;
    else if (event.key === 'ArrowUp') offset = -7;
    else if (event.key === 'ArrowDown') offset = 7;
    else if (event.key === 'Home') offset = -new Date(viewYear, viewMonth, day).getDay();
    else if (event.key === 'End') offset = 6 - new Date(viewYear, viewMonth, day).getDay();
    else return;

    event.preventDefault();
    focusDate(new Date(viewYear, viewMonth, day + offset));
  }

  function handleOutside(e: MouseEvent) {
    if (containerEl && !containerEl.contains(e.target as Node)) { open = false; }
  }

  $effect(() => {
    if (open) {
      const date = value ?? new Date();
      viewYear = date.getFullYear();
      viewMonth = date.getMonth();
      document.addEventListener('click', handleOutside);
      queueMicrotask(() => dialogEl?.querySelector<HTMLElement>('[data-calendar-day][tabindex="0"]')?.focus());
      return () => document.removeEventListener('click', handleOutside);
    }
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      open = false;
      queueMicrotask(() => triggerEl?.focus());
    }
  }

  let displayValue = $derived(
    value
      ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : ''
  );
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={cn('relative', className)} bind:this={containerEl} onkeydown={handleKeydown}>
  <button
    bind:this={triggerEl}
    id={controlId}
    type="button"
    {disabled}
    onclick={() => { if (!disabled) open = !open; }}
    aria-label={ariaLabel}
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-controls={dialogId}
    aria-describedby={ariaDescribedby ?? field?.descriptionId}
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
      {disabled}
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
      bind:this={dialogEl}
      id={dialogId}
      role="dialog"
      aria-label="Choose date"
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

      <div class="grid grid-cols-7 gap-y-0.5" role="grid" aria-label={`${MONTHS[viewMonth]} ${viewYear}`}>
        <div role="row" class="contents">
          {#each DAYS as d}
            <div role="columnheader" class="mb-1 flex h-7 items-center justify-center text-xs font-medium text-[var(--muted-foreground)]">{d}</div>
          {/each}
        </div>
        {#each Array.from({ length: Math.ceil(cells.length / 7) }, (_, week) => cells.slice(week * 7, week * 7 + 7)) as week}
          <div role="row" class="contents">
            {#each Array.from({ length: 7 }, (_, index) => week[index] ?? null) as day}
              {#if day === null}
                <div role="gridcell" aria-hidden="true"></div>
              {:else}
                {@const sel = isSelected(day)}
                {@const tod = isToday(day)}
                {@const dis = isDisabled(day)}
                <button
                  type="button"
                  role="gridcell"
                  aria-label={dateLabel(day)}
                  aria-selected={sel}
                  aria-current={tod ? 'date' : undefined}
                  data-calendar-day
                  data-date={dateKey(viewYear, viewMonth, day)}
                  tabindex={day === focusableDay ? 0 : -1}
                  onclick={() => selectDay(day)}
                  onkeydown={(event) => handleDayKeydown(event, day)}
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
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes -global-popoverIn {
    from { opacity: 0; transform: scale(0.97) translateY(-4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
</style>
