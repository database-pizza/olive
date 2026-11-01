<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import CopyButton from './CopyButton.svelte';

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
</script>

<dl class={cn('flex flex-col divide-y divide-[var(--border)]', className)}>
  {#each items as item}
    <div class="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <dt class="shrink-0 text-xs text-[var(--muted-foreground)]">{item.key}</dt>
      <dd class={cn('flex min-w-0 items-center gap-1 text-[13px] text-[var(--foreground)]', item.mono && 'font-mono text-xs')}>
        <span class="truncate">{item.value}</span>
        {#if item.copyable}
          <CopyButton value={item.value} label="Copy {item.key}" />
        {/if}
      </dd>
    </div>
  {/each}
</dl>
