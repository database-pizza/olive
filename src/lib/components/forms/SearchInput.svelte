<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    value?: string;
    placeholder?: string;
    debounce?: number;
    disabled?: boolean;
    class?: string;
    oninput?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    placeholder = 'Search…',
    debounce = 200,
    disabled = false,
    class: className = '',
    oninput,
  }: Props = $props();

  let timer: ReturnType<typeof setTimeout>;

  function handleInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    value = v;
    clearTimeout(timer);
    timer = setTimeout(() => oninput?.(v), debounce);
  }

  function clear() {
    value = '';
    oninput?.('');
  }
</script>

<div class={cn('relative flex items-center', className)}>
  <svg
    class="pointer-events-none absolute left-3 h-4 w-4 text-[var(--muted-foreground)]"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
  >
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>

  <input
    type="search"
    {placeholder}
    {disabled}
    bind:value
    oninput={handleInput}
    class={cn(
      'flex h-9 w-full rounded-[var(--radius)] border border-[var(--border)] bg-transparent',
      'pl-9 pr-8 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
      'transition-colors duration-[150ms]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
      'disabled:cursor-not-allowed disabled:opacity-40',
      '[&::-webkit-search-cancel-button]:hidden'
    )}
  />

  {#if value}
    <button
      type="button"
      onclick={clear}
      aria-label="Clear search"
      class="absolute right-2.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-[var(--muted-foreground)]/40 text-[var(--background)] hover:bg-[var(--muted-foreground)]/60 transition-colors duration-[150ms]"
    >
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
  {/if}
</div>
