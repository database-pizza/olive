<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils/cn.js';

  interface Props extends HTMLTextareaAttributes {
    class?: string;
    error?: boolean;
  }

  let { class: className = '', error = false, ...rest }: Props = $props();
</script>

<textarea
  class={cn(
    'flex min-h-[80px] w-full rounded-[var(--radius)] border bg-transparent px-3 py-2 text-sm',
    'text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
    'resize-y transition-colors duration-[150ms]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-40',
    error
      ? 'border-[var(--destructive)] focus-visible:ring-[var(--destructive)]'
      : 'border-[var(--border)] focus-visible:border-[var(--ring)]',
    className
  )}
  {...rest}
></textarea>
