<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import CopyButton from './CopyButton.svelte';

  interface Field {
    label: string;
    value: string;
    mono?: boolean;
    copy?: boolean;
    hint?: string;
  }

  interface Props {
    title?: string;
    description?: string;
    fields: Field[];
    footer?: Snippet;
    actions?: Snippet;
    class?: string;
  }

  let {
    title = 'Connection',
    description,
    fields,
    footer,
    actions,
    class: className = '',
  }: Props = $props();
</script>

<section
  class={cn(
    'rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)]',
    'shadow-[var(--shadow-sm)]',
    className,
  )}
>
  <header class="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
    <div>
      <h2 class="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
      {#if description}
        <p class="mt-0.5 text-xs text-[var(--muted-foreground)]">{description}</p>
      {/if}
    </div>
    {#if actions}{@render actions()}{/if}
  </header>

  <dl class="divide-y divide-[var(--border)]">
    {#each fields as field}
      <div class="flex items-center justify-between gap-4 px-4 py-2.5">
        <dt class="shrink-0 text-xs text-[var(--muted-foreground)]">{field.label}</dt>
        <dd class="flex min-w-0 items-center gap-1.5">
          <span class={cn(
            'truncate text-right text-xs text-[var(--foreground)]',
            field.mono && 'font-mono',
          )}>{field.value}</span>
          {#if field.copy}
            <CopyButton value={field.value} label={`Copy ${field.label.toLowerCase()}`} />
          {/if}
        </dd>
      </div>
      {#if field.hint}
        <p class="-mt-1 px-4 pb-2 text-[11px] text-[var(--muted-foreground)]">{field.hint}</p>
      {/if}
    {/each}
  </dl>

  {#if footer}
    <div class="border-t border-[var(--border)] px-4 py-3">
      {@render footer()}
    </div>
  {/if}
</section>
