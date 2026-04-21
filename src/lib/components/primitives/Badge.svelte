<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';

  type Variant = 'default' | 'outline' | 'active' | 'paused' | 'error' | 'warning' | 'info' | 'debug' | 'trace' | 'write' | 'delete';

  interface Props {
    variant?: Variant;
    class?: string;
    children?: Snippet;
  }

  let { variant = 'default', class: className = '', children }: Props = $props();

  const base = 'inline-flex items-center rounded-[9999px] border px-2 py-0.5 text-xs font-medium transition-colors cursor-crosshair';

  const variants: Record<Variant, string> = {
    default:  'bg-[var(--muted)] text-[var(--foreground)] border-transparent',
    outline:  'bg-transparent text-[var(--foreground)] border-[var(--border)]',
    active:   'badge-active',
    paused:   'badge-paused',
    error:    'badge-error',
    warning:  'badge-warning',
    info:     'badge-info',
    debug:    'badge-debug',
    trace:    'badge-trace',
    write:    'badge-write',
    delete:   'badge-delete',
  };
</script>

<span class={cn(base, variants[variant], className)}>
  {#if children}{@render children()}{/if}
</span>
