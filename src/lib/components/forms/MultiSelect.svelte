<script lang="ts">
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { formFieldContext, type FormFieldContext } from '$lib/utils/form-field.js';

  interface Option {
    value: string;
    label: string;
  }

  interface Props {
    options: Option[];
    value?: string[];
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    max?: number;
    class?: string;
    onchange?: (values: string[]) => void;
  }

  let {
    options,
    value = $bindable([]),
    placeholder = 'Select…',
    disabled = false,
    error = false,
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    max,
    class: className = '',
    onchange,
  }: Props = $props();
  const field = getContext<FormFieldContext | undefined>(formFieldContext);
  const componentId = $props.id();
  const listboxId = `${componentId}-listbox`;
  const selectedDescriptionId = `${componentId}-selection`;
  let controlId = $derived(id ?? field?.controlId ?? `${componentId}-control`);

  let open = $state(false);
  let query = $state('');
  let activeIndex = $state(0);
  let containerEl = $state<HTMLElement | null>(null);
  let inputEl = $state<HTMLInputElement | null>(null);

  let filtered = $derived(
    query
      ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
      : options
  );

  let selectedOptions = $derived(options.filter(o => value.includes(o.value)));
  let describedBy = $derived(
    [ariaDescribedby ?? field?.descriptionId, value.length > 0 ? selectedDescriptionId : undefined]
      .filter(Boolean)
      .join(' ') || undefined
  );

  function optionDisabled(opt: Option) {
    return !value.includes(opt.value) && !!max && value.length >= max;
  }

  function enabledIndexes() {
    return filtered
      .map((opt, index) => optionDisabled(opt) ? -1 : index)
      .filter(index => index >= 0);
  }

  function moveActive(direction: 1 | -1) {
    const indexes = enabledIndexes();
    if (indexes.length === 0) {
      activeIndex = -1;
      return;
    }
    const current = indexes.indexOf(activeIndex);
    if (!open || current === -1) {
      activeIndex = direction === 1 ? indexes[0] : indexes[indexes.length - 1];
      return;
    }
    activeIndex = indexes[Math.max(0, Math.min(indexes.length - 1, current + direction))];
  }

  function toggle(opt: Option) {
    if (value.includes(opt.value)) {
      value = value.filter(v => v !== opt.value);
    } else {
      if (max && value.length >= max) return;
      value = [...value, opt.value];
    }
    query = '';
    onchange?.(value);
  }

  function removeTag(v: string) {
    value = value.filter(x => x !== v);
    onchange?.(value);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') { open = false; query = ''; return; }
    if (e.key === 'Backspace' && !query && value.length > 0) {
      value = value.slice(0, -1);
      onchange?.(value);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
      open = true;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
      open = true;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (open && filtered[activeIndex] && !optionDisabled(filtered[activeIndex])) toggle(filtered[activeIndex]);
      else open = true;
    }
    if (e.key === 'Tab') open = false;
  }

  function handleOutside(e: MouseEvent) {
    if (containerEl && !containerEl.contains(e.target as Node)) { open = false; query = ''; }
  }

  $effect(() => {
    if (open) {
      activeIndex = enabledIndexes()[0] ?? -1;
      document.addEventListener('click', handleOutside);
      return () => document.removeEventListener('click', handleOutside);
    }
  });

  $effect(() => {
    query;
    activeIndex = enabledIndexes()[0] ?? -1;
  });
</script>

<div class={cn('relative', className)} bind:this={containerEl}>
  <div
    class={cn(
      'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-[var(--radius)] border bg-transparent px-2 py-1.5',
      'text-sm transition-colors duration-[150ms]',
      error ? 'border-[var(--destructive)]' : 'border-[var(--border)]',
      open && 'ring-2 ring-[var(--ring)]',
      disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-text'
    )}
    onclick={() => { if (!disabled) inputEl?.focus(); }}
    role="none"
  >
    {#each selectedOptions as opt}
      <span class="inline-flex items-center gap-1 rounded-[calc(var(--radius)-4px)] bg-[var(--muted)] px-2 py-0.5 text-xs font-medium text-[var(--foreground)]">
        {opt.label}
        <button
          type="button"
          {disabled}
          onclick={(e) => { e.stopPropagation(); removeTag(opt.value); }}
          class="flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Remove {opt.label}"
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </span>
    {/each}

    <input
      bind:this={inputEl}
      id={controlId}
      type="text"
      {disabled}
      placeholder={value.length === 0 ? placeholder : ''}
      bind:value={query}
      onfocus={() => { open = true; }}
      onkeydown={handleKeydown}
      role="combobox"
      aria-label={ariaLabel}
      aria-expanded={open}
      aria-autocomplete="list"
      aria-controls={listboxId}
      aria-activedescendant={open && activeIndex >= 0 ? `${componentId}-option-${activeIndex}` : undefined}
      aria-describedby={describedBy}
      aria-invalid={error || field?.invalid ? 'true' : undefined}
      class={cn(
        'flex-1 min-w-[80px] bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none',
        disabled && 'cursor-not-allowed'
      )}
    />

    {#if value.length > 0}
      <span id={selectedDescriptionId} class="sr-only">
        Selected: {selectedOptions.map(option => option.label).join(', ')}
      </span>
    {/if}

    <button
      type="button"
      aria-label={open ? 'Close options' : 'Open options'}
      {disabled}
      tabindex="-1"
      onclick={() => { open = !open; if (open) inputEl?.focus(); }}
      class="ml-auto flex cursor-pointer items-center pl-1 text-[var(--muted-foreground)]"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>

  {#if open}
    <div
      id={listboxId}
      role="listbox"
      aria-multiselectable="true"
      class={cn(
        'absolute top-full z-50 mt-1 w-full',
        'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
        'shadow-[var(--shadow-md)] py-1',
        'animate-[popoverIn_150ms_cubic-bezier(0.16,1,0.3,1)] max-h-56 overflow-y-auto'
      )}
    >
      {#if filtered.length === 0}
        <p class="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">No results</p>
      {:else}
        {#each filtered as opt, i}
          {@const selected = value.includes(opt.value)}
          {@const atMax = optionDisabled(opt)}
          <button
            id={`${componentId}-option-${i}`}
            type="button"
            role="option"
            aria-selected={selected}
            tabindex="-1"
            onclick={() => toggle(opt)}
            onmouseenter={() => { activeIndex = i; }}
            disabled={atMax}
            class={cn(
              'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors duration-[100ms]',
              i === activeIndex ? 'bg-[var(--muted)]' : 'hover:bg-[var(--muted)]/60',
              selected ? 'text-[var(--primary)] font-medium' : 'text-[var(--foreground)]',
              atMax && 'opacity-40 cursor-not-allowed'
            )}
          >
            <span
              class={cn(
                'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border transition-colors duration-[100ms]',
                selected
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'border-[var(--border)]'
              )}
            >
              {#if selected}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              {/if}
            </span>
            <span class="flex-1 text-left truncate">{opt.label}</span>
          </button>
        {/each}
      {/if}
      {#if max}
        <p class="border-t border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted-foreground)]">
          {value.length} / {max} selected
        </p>
      {/if}
    </div>
  {/if}
</div>

<style>
  @keyframes -global-popoverIn {
    from { opacity: 0; transform: scale(0.97) translateY(-4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
</style>
