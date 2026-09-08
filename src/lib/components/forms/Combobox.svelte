<script lang="ts">
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { formFieldContext, type FormFieldContext } from '$lib/utils/form-field.js';

  interface Option {
    value: string;
    label: string;
    description?: string;
  }

  interface Props {
    options: Option[];
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    class?: string;
    onchange?: (value: string) => void;
  }

  let {
    options,
    value = $bindable(''),
    placeholder = 'Select…',
    disabled = false,
    error = false,
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    class: className = '',
    onchange,
  }: Props = $props();
  const field = getContext<FormFieldContext | undefined>(formFieldContext);
  const componentId = $props.id();
  const listboxId = `${componentId}-listbox`;
  let controlId = $derived(id ?? field?.controlId ?? `${componentId}-control`);

  let open = $state(false);
  let query = $state('');
  let editing = $state(false);
  let activeIndex = $state(0);
  let containerEl = $state<HTMLElement | null>(null);
  let inputEl = $state<HTMLInputElement | null>(null);

  let selected = $derived(options.find(o => o.value === value));
  let displayValue = $derived(editing ? query : selected?.label ?? '');

  let filtered = $derived(
    query
      ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
      : options
  );

  function select(opt: Option) {
    value = opt.value;
    query = '';
    editing = false;
    open = false;
    onchange?.(opt.value);
  }

  function handleInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      open = false;
      query = '';
      editing = false;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = open ? Math.min(activeIndex + 1, filtered.length - 1) : 0;
      open = true;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = open ? Math.max(activeIndex - 1, 0) : Math.max(filtered.length - 1, 0);
      open = true;
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && filtered[activeIndex]) select(filtered[activeIndex]);
      else open = true;
    } else if (e.key === 'Tab') {
      open = false;
    }
  }

  function handleOutside(e: MouseEvent) {
    if (containerEl && !containerEl.contains(e.target as Node)) {
      open = false;
      query = '';
      editing = false;
    }
  }

  $effect(() => {
    if (open) {
      activeIndex = 0;
      document.addEventListener('click', handleOutside);
      return () => document.removeEventListener('click', handleOutside);
    }
  });

  $effect(() => {
    query;
    activeIndex = 0;
  });
</script>

<div class={cn('relative', className)} bind:this={containerEl}>
  <div
    class={cn(
      'flex h-9 w-full items-center rounded-[var(--radius)] border bg-transparent',
      'text-sm transition-colors duration-[150ms]',
      error ? 'border-[var(--destructive)]' : 'border-[var(--border)]',
      open && 'ring-2 ring-[var(--ring)]',
      disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
    )}
  >
    <input
      bind:this={inputEl}
      id={controlId}
      type="text"
      {disabled}
      placeholder={placeholder}
      value={displayValue}
      oninput={(event) => {
        editing = true;
        query = event.currentTarget.value;
        open = true;
      }}
      onfocus={() => { open = true; }}
      onkeydown={handleInputKeydown}
      role="combobox"
      aria-label={ariaLabel}
      aria-expanded={open}
      aria-autocomplete="list"
      aria-controls={listboxId}
      aria-activedescendant={open && filtered.length > 0 ? `${componentId}-option-${activeIndex}` : undefined}
      aria-describedby={ariaDescribedby ?? field?.descriptionId}
      aria-invalid={error || field?.invalid ? 'true' : undefined}
      class={cn(
        'flex-1 bg-transparent px-3 py-1 text-sm focus:outline-none',
        'text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
        disabled && 'cursor-not-allowed'
      )}
    />
    <button
      type="button"
      aria-label={open ? 'Close options' : 'Open options'}
      {disabled}
      tabindex="-1"
      onclick={() => { open = !open; if (open) inputEl?.focus(); }}
      class="flex h-full cursor-pointer items-center px-2.5 text-[var(--muted-foreground)]"
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
          <button
            id={`${componentId}-option-${i}`}
            type="button"
            role="option"
            aria-selected={opt.value === value}
            tabindex="-1"
            onclick={() => select(opt)}
            onmouseenter={() => { activeIndex = i; }}
            class={cn(
              'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors duration-[100ms]',
              i === activeIndex ? 'bg-[var(--muted)]' : 'hover:bg-[var(--muted)]/60',
              opt.value === value ? 'text-[var(--primary)] font-medium' : 'text-[var(--foreground)]'
            )}
          >
            <span class="flex-1 text-left truncate">{opt.label}</span>
            {#if opt.description}
              <span class="truncate text-xs text-[var(--muted-foreground)]">{opt.description}</span>
            {/if}
            {#if opt.value === value}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            {/if}
          </button>
        {/each}
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
