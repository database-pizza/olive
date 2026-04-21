<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Item {
    key: string;
    value: string;
    mono?: boolean;
    copyable?: boolean;
  }

  interface Props {
    items: Item[];
    class?: string;
  }

  let { items, class: className = '' }: Props = $props();

  let copied = $state<string | null>(null);

  async function copy(value: string, key: string) {
    await navigator.clipboard.writeText(value);
    copied = key;
    setTimeout(() => { copied = null; }, 2000);
  }
</script>

<dl class={cn('flex flex-col divide-y divide-[var(--border)]', className)}>
  {#each items as item}
    <div class="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <dt class="text-sm text-[var(--muted-foreground)] shrink-0">{item.key}</dt>
      <dd class={cn(
        'text-sm text-[var(--foreground)] flex items-center gap-1.5 min-w-0',
        item.mono && 'font-mono text-xs'
      )}>
        <span class="truncate">{item.value}</span>
        {#if item.copyable}
          <button
            type="button"
            onclick={() => copy(item.value, item.key)}
            aria-label="Copy {item.key}"
            class={cn(
              'cursor-pointer shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
              'transition-colors duration-[150ms] focus-visible:outline-none'
            )}
          >
            {#if copied === item.key}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            {:else}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            {/if}
          </button>
        {/if}
      </dd>
    </div>
  {/each}
</dl>
