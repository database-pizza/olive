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
    ...rest
  }: Props = $props();
  const field = getContext<FormFieldContext | undefined>(formFieldContext);
</script>

<textarea
  id={id ?? field?.controlId}
  aria-describedby={ariaDescribedby ?? field?.descriptionId}
  aria-invalid={ariaInvalid ?? (field?.invalid ? 'true' : undefined)}
  class={cn(
    'flex min-h-[80px] w-full rounded-[var(--radius)] border bg-transparent px-3 py-2 text-sm',
    'text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
    'resize-y transition-colors duration-[150ms]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-40',
    error || field?.invalid
      ? 'border-[var(--destructive)] focus-visible:ring-[var(--destructive)]'
      : 'border-[var(--border)] focus-visible:border-[var(--ring)]',
    className
  )}
  {...rest}
></textarea>
