<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import JsonViewer from './JsonViewer.svelte';

  interface Props {
    data: unknown;
    depth?: number;
    expandDepth?: number;
    class?: string;
  }

  let {
    data,
    depth = 0,
    expandDepth = 2,
    class: className = '',
  }: Props = $props();

  type JsonType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

  function getType(v: unknown): JsonType {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    return typeof v as JsonType;
  }

  function isExpandable(v: unknown): boolean {
    if (v === null) return false;
    const t = typeof v;
    return t === 'object';
  }

  function entryCount(v: unknown): number {
    if (Array.isArray(v)) return v.length;
    if (v && typeof v === 'object') return Object.keys(v as object).length;
    return 0;
  }

  let collapsed = $state(depth >= expandDepth);

  const type = getType(data);
  const expandable = isExpandable(data);
  const count = entryCount(data);

  const openBracket = type === 'array' ? '[' : '{';
  const closeBracket = type === 'array' ? ']' : '}';

  let entries = $derived.by((): [string, unknown][] => {
    if (type === 'array') return (data as unknown[]).map((v, i) => [String(i), v]);
    if (type === 'object' && data !== null) return Object.entries(data as Record<string, unknown>);
    return [];
  });
</script>

<div class={cn(depth === 0 && 'font-mono text-xs leading-relaxed', className)}>
  {#if expandable}
    <span>
      <button
        type="button"
        onclick={() => collapsed = !collapsed}
        class="cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors select-none"
        aria-label={collapsed ? 'Expand' : 'Collapse'}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" class={cn('inline transition-transform duration-[100ms]', !collapsed && 'rotate-90')}>
          <path d="M2 1.5L6 4L2 6.5V1.5Z"/>
        </svg>
      </button>
      <span class="text-[var(--muted-foreground)]">{openBracket}</span>

      {#if collapsed}
        <button
          type="button"
          onclick={() => collapsed = false}
          class="mx-1 cursor-pointer rounded px-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
        >
          {count} {type === 'array' ? (count === 1 ? 'item' : 'items') : (count === 1 ? 'key' : 'keys')}
        </button>
        <span class="text-[var(--muted-foreground)]">{closeBracket}</span>
      {:else}
        <div class="ml-4 border-l border-[var(--border)] pl-3">
          {#each entries as [key, val], i}
            <div class="py-px">
              {#if type === 'object'}
                <span class="text-[var(--primary)]/80 font-medium">"{key}"</span>
                <span class="text-[var(--muted-foreground)]">: </span>
              {/if}
              <JsonViewer data={val} depth={depth + 1} {expandDepth} />
              {#if i < entries.length - 1}
                <span class="text-[var(--muted-foreground)]">,</span>
              {/if}
            </div>
          {/each}
        </div>
        <span class="text-[var(--muted-foreground)]">{closeBracket}</span>
      {/if}
    </span>
  {:else if type === 'string'}
    <span class="text-[hsl(160_60%_42%)] dark:text-[hsl(160_70%_58%)]">"{data as string}"</span>
  {:else if type === 'number'}
    <span class="text-[hsl(220_80%_55%)] dark:text-[hsl(220_80%_72%)]">{data as number}</span>
  {:else if type === 'boolean'}
    <span class="text-[hsl(35_90%_45%)] dark:text-[hsl(35_90%_62%)]">{String(data)}</span>
  {:else}
    <span class="text-[var(--muted-foreground)] italic">null</span>
  {/if}
</div>
