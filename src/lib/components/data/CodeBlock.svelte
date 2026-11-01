<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import CopyButton from './CopyButton.svelte';

  interface Props {
    code: string;
    language?: string;
    filename?: string;
    class?: string;
    showLineNumbers?: boolean;
    maxHeight?: string;
  }

  let {
    code,
    language,
    filename,
    class: className = '',
    showLineNumbers = false,
    maxHeight,
  }: Props = $props();

  const lines = $derived(code.split('\n'));
</script>

<div
  class={cn(
    'overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--code)]',
    'shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)]',
    className,
  )}
>
  <div class="flex h-8 items-center gap-2 border-b border-[var(--border)] pl-3 pr-1.5">
    {#if filename}
      <span class="truncate font-mono text-[11px] text-[var(--foreground)]">{filename}</span>
    {:else if language}
      <span class="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--subtle-foreground)]">
        {language}
      </span>
    {:else}
      <span class="flex gap-1" aria-hidden="true">
        <span class="size-1.5 rounded-full bg-[var(--border-strong)]"></span>
        <span class="size-1.5 rounded-full bg-[var(--border-strong)]"></span>
        <span class="size-1.5 rounded-full bg-[var(--border-strong)]"></span>
      </span>
    {/if}
    <div class="ml-auto">
      <CopyButton value={code} label="Copy code" copiedLabel="Copied" />
    </div>
  </div>

  <pre
    class="overflow-auto px-3 py-3 font-mono text-[12px] leading-[1.65] text-[var(--code-foreground)]"
    style:max-height={maxHeight}><code class="grid">{#if showLineNumbers}{#each lines as line, i}<span class="grid grid-cols-[2.25rem_1fr] gap-2"><span class="select-none text-right text-[var(--subtle-foreground)]">{i + 1}</span><span class="whitespace-pre">{line || ' '}</span></span>{/each}{:else}<span class="whitespace-pre">{code}</span>{/if}</code></pre>
</div>
