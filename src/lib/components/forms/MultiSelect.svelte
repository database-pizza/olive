<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

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
    max,
    class: className = '',
    onchange,
  }: Props = $props();

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
    if (e.key === 'Escape') { open = false; return; }
    if (e.key === 'Backspace' && !query && value.length > 0) {
      value = value.slice(0, -1);
      onchange?.(value);
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); }
    if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) toggle(filtered[activeIndex]); }
  }

  function handleOutside(e: MouseEvent) {
    if (containerEl && !containerEl.contains(e.target as Node)) { open = false; query = ''; }
  }

  $effect(() => {
    if (open) {
      activeIndex = 0;
      document.addEventListener('click', handleOutside);
      return () => document.removeEventListener('click', handleOutside);
    }
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
      type="text"
      {disabled}
      placeholder={value.length === 0 ? placeholder : ''}
      bind:value={query}
      onfocus={() => { open = true; }}
      onkeydown={handleKeydown}
      class={cn(
        'flex-1 min-w-[80px] bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none',
        disabled && 'cursor-not-allowed'
      )}
    />

    <button
      type="button"
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
          {@const atMax = !selected && !!max && value.length >= max}
          <button
            type="button"
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
  @keyframes popoverIn {
    from { opacity: 0; transform: scale(0.97) translateY(-4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
</style>
