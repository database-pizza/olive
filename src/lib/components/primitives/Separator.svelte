<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type Orientation = 'horizontal' | 'vertical';

  interface Props {
    orientation?: Orientation;
    class?: string;
    label?: string;
  }

  let { orientation = 'horizontal', class: className = '', label }: Props = $props();
</script>

{#if label}
  <div
    class={cn(
      'flex items-center gap-3',
      orientation === 'vertical' && 'h-full flex-col',
      className,
    )}
    role="separator"
    aria-orientation={orientation}
  >
    <span class={cn('bg-[var(--border)]', orientation === 'horizontal' ? 'h-px flex-1' : 'w-px flex-1')}></span>
    <span class="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--subtle-foreground)]">{label}</span>
    <span class={cn('bg-[var(--border)]', orientation === 'horizontal' ? 'h-px flex-1' : 'w-px flex-1')}></span>
  </div>
{:else}
  <div
    role="separator"
    aria-orientation={orientation}
    class={cn(
      'shrink-0 bg-[var(--border)]',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className,
    )}
  ></div>
{/if}
