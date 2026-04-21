<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

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
    class?: string;
    onchange?: (value: string) => void;
  }

  let {
    options,
    value = $bindable(''),
    placeholder = 'Select…',
    disabled = false,
    error = false,
    class: className = '',
    onchange,
  }: Props = $props();

  let open = $state(false);
  let query = $state('');
  let activeIndex = $state(0);
  let containerEl = $state<HTMLElement | null>(null);
  let inputEl = $state<HTMLInputElement | null>(null);

  let selected = $derived(options.find(o => o.value === value));

  let filtered = $derived(
    query
      ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
      : options
  );

  function select(opt: Option) {
    value = opt.value;
    query = '';
    open = false;
    onchange?.(opt.value);
  }

  function handleInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') { open = false; return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); }
    if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) select(filtered[activeIndex]); }
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
      'flex h-9 w-full items-center rounded-[var(--radius)] border bg-transparent',
      'text-sm transition-colors duration-[150ms]',
      error ? 'border-[var(--destructive)]' : 'border-[var(--border)]',
      open && 'ring-2 ring-[var(--ring)]',
      disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
    )}
  >
    <input
      bind:this={inputEl}
      type="text"
      {disabled}
      placeholder={selected ? selected.label : placeholder}
      bind:value={query}
      onfocus={() => { open = true; }}
      onkeydown={handleInputKeydown}
      class={cn(
        'flex-1 bg-transparent px-3 py-1 text-sm focus:outline-none',
        selected && !query ? 'text-[var(--foreground)]' : 'text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
        disabled && 'cursor-not-allowed'
      )}
    />
    <button
      type="button"
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
            type="button"
            onclick={() => select(opt)}
            onmouseenter={() => { activeIndex = i; }}
            class={cn(
              'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors duration-[100ms]',
              i === activeIndex ? 'bg-[var(--muted)]' : 'hover:bg-[var(--muted)]/60',
              opt.value === value ? 'text-[var(--primary)] font-medium' : 'text-[var(--foreground)]'
            )}
          >
            <span class="flex-1 text-left truncate">{opt.label}</span>
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
  @keyframes popoverIn {
    from { opacity: 0; transform: scale(0.97) translateY(-4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
</style>
