<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { popupElement, popupTrigger } from '$lib/utils/popup.js';

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
    side?: 'bottom' | 'top';
    class?: string;
    trigger?: Snippet;
  }

  let { items, align = 'start', side = 'bottom', class: className = '', trigger }: Props = $props();

  let open = $state(false);
  let containerEl = $state<HTMLElement | null>(null);
  let triggerEl = $state<HTMLElement | null>(null);
  let menuEl = $state<HTMLElement | null>(null);
  const dropdownId = $props.id();
  const menuId = `${dropdownId}-menu`;

  function focusItem(index: number) {
    queueMicrotask(() => {
      const items = Array.from(menuEl?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? []);
      if (items.length === 0) return;
      items[(index + items.length) % items.length]?.focus();
    });
  }

  function toggle() {
    open = !open;
    if (open) focusItem(0);
  }
  function close() { open = false; }

  function handleKeydown(e: KeyboardEvent) {
    const items = Array.from(menuEl?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? []);
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    const fromTrigger = !!triggerEl && triggerEl.contains(e.target as Node);

    if (e.key === 'Escape' && open) {
      e.preventDefault();
      close();
      popupElement(triggerEl)?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) open = true;
      focusItem(fromTrigger ? 0 : currentIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) open = true;
      focusItem(fromTrigger ? -1 : currentIndex - 1);
    } else if (e.key === 'Home' && open) {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === 'End' && open) {
      e.preventDefault();
      focusItem(-1);
    } else if (e.key === 'Tab' && open) {
      close();
    }
  }

  function handleOutside(e: MouseEvent) {
    if (containerEl && !containerEl.contains(e.target as Node)) close();
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
  bind:this={containerEl}
  onkeydown={handleKeydown}
>
  <!-- Trigger -->
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    bind:this={triggerEl}
    use:popupTrigger={{ expanded: open, controls: menuId, haspopup: 'menu' }}
    onclick={toggle}
    class="inline-flex"
  >
    {#if trigger}{@render trigger()}{/if}
  </div>

  <!-- Menu -->
  {#if open}
    <div
      bind:this={menuEl}
      id={menuId}
      role="menu"
      class={cn(
        'absolute z-50 mt-1 min-w-[160px]',
        side === 'top' ? 'bottom-full mb-1' : 'top-full',
        'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
        'shadow-[var(--shadow-md)] p-1',
        'animate-[fadeInScale_150ms_cubic-bezier(0.16,1,0.3,1)]',
        align === 'end' ? 'right-0' : 'left-0',
      )}
    >
      {#each items as item}
        {#if item.separator}
          <div role="separator" class="my-1 h-px bg-[var(--border)]"></div>
        {:else}
          <button
            role="menuitem"
            tabindex="-1"
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
              <span aria-hidden="true" class="text-[var(--muted-foreground)]">{item.icon}</span>
            {/if}
            {item.label}
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  @keyframes -global-fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
</style>
