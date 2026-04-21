<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    code: string;
    language?: string;
    class?: string;
  }

  let { code, language, class: className = '' }: Props = $props();

  let copied = $state(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => { copied = false; }, 2000);
  }
</script>

<div class={cn('relative rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)]/50 overflow-hidden', className)}>
  <!-- Header bar -->
  <div class="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
    {#if language}
      <span class="text-xs font-mono text-[var(--muted-foreground)] uppercase tracking-wide">{language}</span>
    {:else}
      <span></span>
    {/if}
    <button
      type="button"
      onclick={copy}
      aria-label="Copy code"
      class={cn(
        'flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
        'cursor-pointer transition-colors duration-[150ms]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded'
      )}
    >
      {#if copied}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        Copied
      {:else}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy
      {/if}
    </button>
  </div>

  <!-- Code -->
  <pre class="overflow-x-auto px-4 py-3 text-sm font-mono text-[var(--foreground)] leading-relaxed"><code>{code}</code></pre>
</div>
