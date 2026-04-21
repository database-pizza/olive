<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import CodeBlock from '$lib/components/data/CodeBlock.svelte';

  interface Prop {
    name: string;
    type: string;
    default?: string;
    description: string;
  }

  interface Props {
    name: string;
    description?: string;
    code: string;
    props?: Prop[];
    preview?: Snippet;
    class?: string;
  }

  let {
    name,
    description,
    code,
    props = [],
    preview,
    class: className = '',
  }: Props = $props();

  let tab = $state<'preview' | 'code' | 'props'>('preview');
  const tabs = ['preview', 'code', ...(props.length ? ['props'] : [])] as const;
</script>

<div id={name.toLowerCase().replace(/\s+/g, '-')} class={cn('scroll-mt-20', className)}>
  <!-- Title -->
  <div class="mb-4">
    <h3 class="text-base font-semibold text-[var(--foreground)]">{name}</h3>
    {#if description}
      <p class="mt-0.5 text-sm text-[var(--muted-foreground)]">{description}</p>
    {/if}
  </div>

  <!-- Unified card -->
  <div class="overflow-hidden rounded-[var(--radius)] border border-[var(--border)]">

    <!-- Tab strip -->
    <div class="flex items-center gap-0 border-b border-[var(--border)] bg-[var(--card)] px-1">
      {#each tabs as t}
        <button
          type="button"
          onclick={() => tab = t as typeof tab}
          class={cn(
            'relative px-3 py-2.5 text-xs font-medium cursor-pointer capitalize transition-colors duration-[100ms]',
            'focus-visible:outline-none',
            tab === t
              ? 'text-[var(--foreground)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          )}
        >
          {t}
          {#if tab === t}
            <span class="absolute inset-x-0 bottom-0 h-px bg-[var(--foreground)]"></span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Panel -->
    {#if tab === 'preview'}
      <div class="flex min-h-[120px] flex-wrap items-center gap-4 bg-[var(--background)] p-6">
        {#if preview}
          {@render preview()}
        {/if}
      </div>
    {:else if tab === 'code'}
      <CodeBlock {code} language="svelte" class="rounded-none border-0 shadow-none" />
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-[var(--border)] bg-[var(--muted)]/40">
              <th class="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Prop</th>
              <th class="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Type</th>
              <th class="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Default</th>
              <th class="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Description</th>
            </tr>
          </thead>
          <tbody>
            {#each props as p, i}
              <tr class={cn('border-b border-[var(--border)] last:border-0', i % 2 === 1 && 'bg-[var(--muted)]/10')}>
                <td class="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-[var(--foreground)]">{p.name}</td>
                <td class="px-4 py-2.5 font-mono text-xs text-[var(--primary)]/80">{p.type}</td>
                <td class="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-[var(--muted-foreground)]">{p.default ?? '—'}</td>
                <td class="px-4 py-2.5 text-xs text-[var(--foreground)]">{p.description}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
