<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type Level = 'debug' | 'info' | 'warn' | 'error';

  interface LogLine {
    id?: string;
    timestamp?: string | number | Date;
    level?: Level;
    message: string;
  }

  interface Props {
    lines: LogLine[];
    height?: string;
    autoScroll?: boolean;
    empty?: string;
    class?: string;
  }

  let {
    lines,
    height = '20rem',
    autoScroll = true,
    empty = 'No output yet',
    class: className = '',
  }: Props = $props();

  let viewport = $state<HTMLDivElement | null>(null);
  let pinned = $state(true);

  const levelClass: Record<Level, string> = {
    debug: 'text-[var(--muted-foreground)]',
    info: 'text-[var(--foreground)]',
    warn: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
  };

  function onScroll() {
    if (!viewport) return;
    pinned = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 24;
  }

  $effect(() => {
    if (!autoScroll || !pinned || !viewport || lines.length === 0) return;
    viewport.scrollTop = viewport.scrollHeight;
  });

  function formatTime(value: LogLine['timestamp']) {
    if (value === undefined) return '';
    if (value instanceof Date) return value.toLocaleTimeString();
    if (typeof value === 'number') return new Date(value * 1000).toLocaleTimeString();
    return String(value);
  }
</script>

<div
  bind:this={viewport}
  onscroll={onScroll}
  class={cn(
    'overflow-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]',
    'font-mono text-[11px] leading-relaxed',
    className,
  )}
  style={`height:${height}`}
  role="log"
  aria-live="polite"
>
  {#if lines.length === 0}
    <p class="p-4 text-[var(--muted-foreground)]">{empty}</p>
  {:else}
    <div class="divide-y divide-[var(--border)]/60">
      {#each lines as line, index (line.id ?? index)}
        <div class="flex gap-3 px-3 py-1 hover:bg-[var(--muted)]/40">
          {#if line.timestamp !== undefined}
            <span class="shrink-0 tabular-nums text-[var(--muted-foreground)]/70">{formatTime(line.timestamp)}</span>
          {/if}
          {#if line.level}
            <span class={cn('w-12 shrink-0 uppercase', levelClass[line.level])}>{line.level}</span>
          {/if}
          <span class={cn('min-w-0 whitespace-pre-wrap break-words', line.level ? levelClass[line.level] : 'text-[var(--foreground)]')}>
            {line.message}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>
