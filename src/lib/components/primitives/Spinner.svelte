<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  type Size = 'xs' | 'sm' | 'md' | 'lg';

  interface Props {
    size?: Size;
    class?: string;
    label?: string;
  }

  let { size = 'md', class: className = '', label = 'Loading' }: Props = $props();

  const sizes: Record<Size, string> = {
    xs: 'size-3 border-[1.5px]',
    sm: 'size-3.5 border-[1.5px]',
    md: 'size-4 border-2',
    lg: 'size-5 border-2',
  };
</script>

<span
  role="status"
  aria-label={label}
  class={cn(
    'inline-block shrink-0 animate-[olive-spin_700ms_linear_infinite] rounded-full',
    'border-current/25 border-t-current',
    sizes[size],
    className,
  )}
></span>
