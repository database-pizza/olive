<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  interface Props {
    src?: string;
    alt?: string;
    initials?: string;
    size?: Size;
    status?: 'online' | 'away' | 'busy' | 'offline';
    class?: string;
  }

  let {
    src,
    alt = '',
    initials,
    size = 'md',
    status,
    class: className = '',
  }: Props = $props();

  const sizes: Record<Size, string> = {
    xs: 'size-5 text-[9px]',
    sm: 'size-6 text-[10px]',
    md: 'size-8 text-[11px]',
    lg: 'size-10 text-sm',
    xl: 'size-14 text-lg',
  };

  const statusSizes: Record<Size, string> = {
    xs: 'size-1.5',
    sm: 'size-2',
    md: 'size-2.5',
    lg: 'size-2.5',
    xl: 'size-3.5',
  };

  const statusColors = {
    online: 'bg-[var(--success)]',
    away: 'bg-[var(--warning)]',
    busy: 'bg-[var(--destructive)]',
    offline: 'bg-[var(--subtle-foreground)]',
  } as const;

  let imgError = $state(false);
  let label = $derived((initials ?? alt ?? '').trim().slice(0, 2).toUpperCase());
</script>

<div class={cn('relative inline-flex shrink-0', className)}>
  <div
    class={cn(
      'flex select-none items-center justify-center overflow-hidden rounded-full',
      'border border-[var(--border)] bg-[var(--muted)] font-semibold text-[var(--muted-foreground)]',
      'shadow-[var(--olive-inset-highlight)]',
      sizes[size],
    )}
  >
    {#if src && !imgError}
      <img
        {src}
        {alt}
        class="size-full object-cover"
        onerror={() => {
          imgError = true;
        }}
      />
    {:else if label}
      <span aria-hidden={alt ? 'true' : undefined}>{label}</span>
      {#if alt}<span class="sr-only">{alt}</span>{/if}
    {:else}
      <svg viewBox="0 0 24 24" fill="currentColor" class="size-4/5 opacity-40" aria-hidden="true">
        <path
          d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
        />
      </svg>
    {/if}
  </div>
  {#if status}
    <span
      class={cn(
        'absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--card)]',
        statusSizes[size],
        statusColors[status],
      )}
      aria-label={status}
    ></span>
  {/if}
</div>
