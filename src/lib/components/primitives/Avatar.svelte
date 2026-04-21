<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type Size = 'sm' | 'md' | 'lg';

  interface Props {
    src?: string;
    alt?: string;
    initials?: string;
    size?: Size;
    class?: string;
  }

  let { src, alt = '', initials, size = 'md', class: className = '' }: Props = $props();

  const sizes: Record<Size, string> = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  let imgError = $state(false);
</script>

<div
  class={cn(
    'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full',
    'bg-[var(--muted)] text-[var(--muted-foreground)] font-medium select-none',
    sizes[size],
    className
  )}
>
  {#if src && !imgError}
    <img
      {src}
      {alt}
      class="h-full w-full object-cover"
      onerror={() => { imgError = true; }}
    />
  {:else if initials}
    <span>{initials.slice(0, 2).toUpperCase()}</span>
  {:else}
    <svg viewBox="0 0 24 24" fill="currentColor" class="h-4/5 w-4/5 opacity-60">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  {/if}
</div>
