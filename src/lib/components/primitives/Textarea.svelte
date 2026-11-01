<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { formFieldContext, type FormFieldContext } from '$lib/utils/form-field.js';

  interface Props extends HTMLTextareaAttributes {
    class?: string;
    error?: boolean;
  }

  let {
    class: className = '',
    error = false,
    id,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    rows = 3,
    ...rest
  }: Props = $props();

  const field = getContext<FormFieldContext | undefined>(formFieldContext);
</script>

<textarea
  id={id ?? field?.controlId}
  aria-describedby={ariaDescribedby ?? field?.descriptionId}
  aria-invalid={ariaInvalid ?? (field?.invalid ? 'true' : undefined)}
  {rows}
  class={cn(
    'flex w-full min-w-0 resize-y border bg-[var(--card)] px-3 py-2 text-[13px] leading-relaxed',
    'rounded-[var(--radius-button)] text-[var(--foreground)]',
    'shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)]',
    'outline-none transition-[border-color,box-shadow,background-color]',
    'duration-[var(--duration-fast)] ease-[var(--ease-move)]',
    'placeholder:text-[var(--subtle-foreground)]',
    'hover:border-[var(--border-strong)]',
    'focus:border-[var(--ring)] focus:ring-[3px] focus:ring-[color-mix(in_oklab,var(--ring)_18%,transparent)]',
    'disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:opacity-60',
    error || field?.invalid
      ? 'border-[color-mix(in_oklab,var(--destructive)_55%,transparent)] focus:border-[var(--destructive)]'
      : 'border-[var(--input)]',
    className,
  )}
  {...rest}
></textarea>
