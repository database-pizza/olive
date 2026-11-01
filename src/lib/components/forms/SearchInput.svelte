<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import Kbd from '$lib/components/primitives/Kbd.svelte';

  interface Props {
    value?: string;
    placeholder?: string;
    debounce?: number;
    disabled?: boolean;
    size?: 'sm' | 'md';
    shortcut?: string;
    class?: string;
    oninput?: (value: string) => void;
    onsubmit?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    placeholder = 'Search…',
    debounce = 200,
    disabled = false,
    size = 'md',
    shortcut,
    class: className = '',
    oninput,
    onsubmit,
  }: Props = $props();

  let timer: ReturnType<typeof setTimeout> | undefined;

  function handleInput(event: Event) {
    const next = (event.target as HTMLInputElement).value;
    value = next;
    clearTimeout(timer);
    timer = setTimeout(() => oninput?.(next), debounce);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter') return;
    clearTimeout(timer);
    onsubmit?.(value);
  }

  function clear() {
    value = '';
    clearTimeout(timer);
    oninput?.('');
  }
</script>

<div class={cn('group relative flex items-center', className)}>
  <svg
    class="pointer-events-none absolute left-2.5 size-3.5 text-[var(--subtle-foreground)]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>

  <input
    type="search"
    {placeholder}
    {disabled}
    bind:value
    oninput={handleInput}
    onkeydown={handleKeydown}
    class={cn(
      'w-full rounded-[var(--radius-button)] border border-[var(--input)] bg-[var(--card)]',
      'pl-8 pr-16 text-[13px] text-[var(--foreground)] shadow-[var(--olive-inset-highlight)]',
      'outline-none transition-[border-color,box-shadow,background-color] duration-[var(--duration-fast)]',
      'placeholder:text-[var(--subtle-foreground)] hover:border-[var(--border-strong)]',
      'focus:border-[var(--ring)] focus:ring-[3px] focus:ring-[color-mix(in_oklab,var(--ring)_18%,transparent)]',
      'disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:opacity-60',
      '[&::-webkit-search-cancel-button]:hidden',
      size === 'sm' ? 'h-8 sm:h-7' : 'h-9 sm:h-8',
    )}
  />

  <div class="absolute right-1.5 flex items-center gap-1">
    {#if value}
      <button
        type="button"
        onclick={clear}
        aria-label="Clear search"
        class="flex size-5 items-center justify-center rounded-[var(--radius-xs)] text-[var(--subtle-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    {:else if shortcut}
      <Kbd size="sm">{shortcut}</Kbd>
    {/if}
  </div>
</div>
