<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  interface Item {
    label: string;
    icon?: string;
    variant?: 'default' | 'destructive';
    disabled?: boolean;
    separator?: boolean;
    onclick?: () => void;
  }

  interface Props {
    items: Item[];
    align?: 'start' | 'end';
    class?: string;
    trigger?: Snippet;
  }

  let { items, align = 'start', class: className = '', trigger }: Props = $props();

  let open = $state(false);
  let menuEl = $state<HTMLElement | null>(null);

  function toggle() { open = !open; }
  function close() { open = false; }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  function handleOutside(e: MouseEvent) {
    if (menuEl && !menuEl.contains(e.target as Node)) close();
  }

  $effect(() => {
    if (open) {
      document.addEventListener('click', handleOutside);
      return () => document.removeEventListener('click', handleOutside);
    }
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={cn('relative inline-flex', className)}
  bind:this={menuEl}
  onkeydown={handleKeydown}
>
  <!-- Trigger -->
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div onclick={toggle} class="inline-flex">
    {#if trigger}{@render trigger()}{/if}
  </div>

  <!-- Menu -->
  {#if open}
    <div
      role="menu"
      class={cn(
        'absolute top-full z-50 mt-1 min-w-[160px]',
        'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
        'shadow-[var(--shadow-md)] p-1',
        'animate-[fadeInScale_150ms_cubic-bezier(0.16,1,0.3,1)]',
        align === 'end' ? 'right-0' : 'left-0',
      )}
    >
      {#each items as item}
        {#if item.separator}
          <div class="my-1 h-px bg-[var(--border)]"></div>
        {:else}
          <button
            role="menuitem"
            disabled={item.disabled}
            onclick={() => { item.onclick?.(); close(); }}
            class={cn(
              'flex w-full items-center gap-2 rounded-[calc(var(--radius)*0.67)] px-2.5 py-1.5 text-sm',
              'transition-colors duration-[100ms] text-left',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset',
              'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
              item.variant === 'destructive'
                ? 'text-[var(--destructive)] hover:bg-[var(--destructive)]/10'
                : 'text-[var(--foreground)] hover:bg-[var(--muted)]',
            )}
          >
            {#if item.icon}
              <span class="text-[var(--muted-foreground)]">{item.icon}</span>
            {/if}
            {item.label}
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
</style>
