<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { formFieldContext, type FormFieldContext } from '$lib/utils/form-field.js';

  type Size = 'sm' | 'md' | 'lg';

  interface Props extends HTMLInputAttributes {
    class?: string;
    error?: boolean;
    uiSize?: Size;
  }

  let {
    class: className = '',
    error = false,
    uiSize = 'md',
    id,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    ...rest
  }: Props = $props();

  const field = getContext<FormFieldContext | undefined>(formFieldContext);

  const sizes: Record<Size, string> = {
    sm: 'h-8 px-2.5 text-xs rounded-[var(--radius-sm)] sm:h-7',
    md: 'h-9 px-3 text-[13px] rounded-[var(--radius-button)] sm:h-8',
    lg: 'h-10 px-3.5 text-sm rounded-[var(--radius-control)]',
  };
</script>

<input
  id={id ?? field?.controlId}
  aria-describedby={ariaDescribedby ?? field?.descriptionId}
  aria-invalid={ariaInvalid ?? (field?.invalid ? 'true' : undefined)}
  class={cn(
    'flex w-full min-w-0 border bg-[var(--card)] text-[var(--foreground)]',
    'shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)]',
    'outline-none transition-[border-color,box-shadow,background-color]',
    'duration-[var(--duration-fast)] ease-[var(--ease-move)]',
    'placeholder:text-[var(--subtle-foreground)]',
    'hover:border-[var(--border-strong)]',
    'focus:border-[var(--ring)] focus:ring-[3px] focus:ring-[color-mix(in_oklab,var(--ring)_18%,transparent)]',
    'disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:opacity-60',
    'file:mr-2 file:border-0 file:bg-transparent file:text-xs file:font-medium',
    sizes[uiSize],
    error || field?.invalid
      ? 'border-[color-mix(in_oklab,var(--destructive)_55%,transparent)] focus:border-[var(--destructive)] focus:ring-[color-mix(in_oklab,var(--destructive)_16%,transparent)]'
      : 'border-[var(--input)]',
    className,
  )}
  {...rest}
/>
