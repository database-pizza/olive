<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { setContext } from 'svelte';

  interface Props {
    name?: string;
    error?: string;
    hint?: string;
    class?: string;
    children?: Snippet;
  }

  let { name = '', error = '', hint = '', class: className = '', children }: Props = $props();

  setContext('form-field', {
    get name() { return name; },
    get error() { return error; },
    get hint() { return hint; },
  });
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
  {#if children}{@render children()}{/if}
  {#if error}
    <p class="text-xs text-[var(--destructive)]">{error}</p>
  {:else if hint}
    <p class="text-xs text-[var(--muted-foreground)]">{hint}</p>
  {/if}
</div>
