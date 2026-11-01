<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { popupElement, popupTrigger } from '$lib/utils/popup.js';
  import { popIn, popOut } from '$lib/utils/transitions.js';

  interface Item {
    label: string;
    icon?: string;
    variant?: 'default' | 'destructive';
    disabled?: boolean;
    separator?: boolean;
    checked?: boolean;
    shortcut?: string;
    onclick?: () => void;
  }

  interface Props {
    items: Item[];
    align?: 'start' | 'end';
    side?: 'bottom' | 'top';
    class?: string;
    trigger?: Snippet;
    onopenchange?: (open: boolean) => void;
  }

  let {
    items,
    align = 'start',
    side = 'bottom',
    class: className = '',
    trigger,
    onopenchange,
  }: Props = $props();

  let open = $state(false);
  let triggerEl = $state<HTMLElement | null>(null);
  let menuEl = $state<HTMLElement | null>(null);
  let wrapperEl = $state<HTMLElement | null>(null);
  const dropdownId = $props.id();
  const menuId = `${dropdownId}-menu`;

  let pos = $state({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    minWidth: 180,
    placement: 'bottom' as 'top' | 'bottom',
    ready: false,
  });

  function measure() {
    if (!triggerEl || typeof window === 'undefined') return;
    const rect = triggerEl.getBoundingClientRect();
    const menuHeight = menuEl?.getBoundingClientRect().height ?? 200;
    const menuWidth = menuEl?.getBoundingClientRect().width ?? Math.max(rect.width, 180);
    const gap = 6;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const placement: 'top' | 'bottom' =
      side === 'top' ||
      (spaceBelow < menuHeight + gap + 8 && spaceAbove > menuHeight + gap)
        ? 'top'
        : 'bottom';

    pos = {
      left: Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - menuWidth - 8)),
      right: Math.max(8, window.innerWidth - rect.right),
      top: rect.bottom + gap,
      bottom: window.innerHeight - rect.top + gap,
      minWidth: Math.max(rect.width, 180),
      placement,
      ready: true,
    };
  }

  function setOpen(next: boolean) {
    if (open === next) return;
    open = next;
    if (next) pos = { ...pos, ready: false };
    onopenchange?.(next);
    if (next) queueMicrotask(measure);
  }

  function close() {
    setOpen(false);
  }

  function focusItem(index: number) {
    queueMicrotask(() => {
      const nodes = Array.from(
        menuEl?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [],
      );
      if (!nodes.length) return;
      nodes[(index + nodes.length) % nodes.length]?.focus();
    });
  }

  function handleKeydown(event: KeyboardEvent) {
    const nodes = Array.from(
      menuEl?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [],
    );
    const currentIndex = nodes.indexOf(document.activeElement as HTMLButtonElement);
    const fromTrigger = !!triggerEl && triggerEl.contains(event.target as Node);

    if (event.key === 'Escape' && open) {
      event.preventDefault();
      close();
      popupElement(triggerEl)?.focus();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) setOpen(true);
      focusItem(fromTrigger ? 0 : currentIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) setOpen(true);
      focusItem(fromTrigger ? -1 : currentIndex - 1);
    } else if (event.key === 'Home' && open) {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === 'End' && open) {
      event.preventDefault();
      focusItem(-1);
    } else if (event.key === 'Tab' && open) {
      close();
    }
  }

  $effect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (wrapperEl?.contains(target) || menuEl?.contains(target)) return;
      close();
    };
    const onViewportChange = () => {
      measure();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, true);
    };
  });

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={cn('relative inline-flex', className)}
  bind:this={wrapperEl}
  onkeydown={handleKeydown}
>
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    bind:this={triggerEl}
    use:popupTrigger={{ expanded: open, controls: menuId, haspopup: 'menu' }}
    onclick={() => setOpen(!open)}
    class="inline-flex"
  >
    {#if trigger}{@render trigger()}{/if}
  </div>
</div>

{#if open}
  <div
    use:portal
    id={menuId}
    bind:this={menuEl}
    role="menu"
    aria-orientation="vertical"
    in:popIn={{ y: pos.placement === 'top' ? -4 : 4, duration: 180 }}
    out:popOut={{ y: 4, duration: 120 }}
    class="fixed z-[110] max-w-[min(20rem,calc(100vw-1rem))] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--popover)] p-1 shadow-[var(--olive-shadow-popover)]"
    style:left={align === 'end' ? 'auto' : `${pos.left}px`}
    style:right={align === 'end' ? `${pos.right}px` : 'auto'}
    style:top={pos.placement === 'bottom' ? `${pos.top}px` : 'auto'}
    style:bottom={pos.placement === 'top' ? `${pos.bottom}px` : 'auto'}
    style:min-width="{pos.minWidth}px"
    style:visibility={pos.ready ? 'visible' : 'hidden'}
  >
    {#each items as item}
      {#if item.separator}
        <div role="separator" class="my-1 h-px bg-[var(--border)]"></div>
      {:else}
        <button
          type="button"
          role="menuitem"
          tabindex="-1"
          disabled={item.disabled}
          onclick={() => {
            item.onclick?.();
            close();
          }}
          class={cn(
            'flex h-7 w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 text-left text-[13px] outline-none',
            'transition-colors duration-[var(--duration-micro)]',
            'focus-visible:bg-[var(--accent)] focus-visible:text-[var(--foreground)]',
            'disabled:pointer-events-none disabled:opacity-40',
            item.variant === 'destructive'
              ? 'text-[var(--destructive-foreground-soft)] hover:bg-[var(--destructive-soft)]'
              : 'text-[var(--foreground)] hover:bg-[var(--accent)]',
          )}
        >
          {#if item.icon}
            <span class="flex size-3.5 items-center justify-center text-[var(--muted-foreground)]" aria-hidden="true">
              {item.icon}
            </span>
          {/if}
          {#if item.checked}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          {/if}
          <span class="min-w-0 flex-1 truncate">{item.label}</span>
          {#if item.shortcut}
            <kbd class="ml-auto shrink-0 font-mono text-[10px] text-[var(--subtle-foreground)]">{item.shortcut}</kbd>
          {/if}
        </button>
      {/if}
    {/each}
  </div>
{/if}
