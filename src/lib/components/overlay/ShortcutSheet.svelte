<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import Dialog from '$lib/components/overlay/Dialog.svelte';

  interface Shortcut {
    keys: string[];
    description: string;
  }

  interface Props {
    open?: boolean;
    groups: Array<{ title: string; shortcuts: Shortcut[] }>;
    title?: string;
    class?: string;
    footer?: Snippet;
  }

  let {
    open = $bindable(false),
    groups,
    title = 'Keyboard shortcuts',
    class: className = '',
    footer,
  }: Props = $props();
</script>

<Dialog bind:open {title} class={cn('sm:max-w-lg', className)}>
  <div class="flex max-h-[60vh] flex-col gap-5 overflow-y-auto">
    {#each groups as group}
      <section class="flex flex-col gap-2">
        <h3 class="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {group.title}
        </h3>
        <ul class="flex flex-col gap-1.5">
          {#each group.shortcuts as shortcut}
            <li class="flex items-center justify-between gap-4 text-xs">
              <span class="text-[var(--foreground)]">{shortcut.description}</span>
              <span class="flex shrink-0 items-center gap-1">
                {#each shortcut.keys as key}
                  <kbd class="inline-flex h-5 min-w-5 items-center justify-center rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 font-mono text-[10px] text-[var(--muted-foreground)]">
                    {key}
                  </kbd>
                {/each}
              </span>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
  {#if footer}
    <div class="mt-4 border-t border-[var(--border)] pt-3">{@render footer()}</div>
  {/if}
</Dialog>
