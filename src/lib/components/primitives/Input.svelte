<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { formFieldContext, type FormFieldContext } from '$lib/utils/form-field.js';

  interface Props extends HTMLInputAttributes {
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

<input
  id={id ?? field?.controlId}
  aria-describedby={ariaDescribedby ?? field?.descriptionId}
  aria-invalid={ariaInvalid ?? (field?.invalid ? 'true' : undefined)}
  class={cn(
    'flex h-9 w-full rounded-[var(--radius)] border bg-transparent px-3 py-1 text-sm',
    'text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]',
    'transition-colors duration-[150ms]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:opacity-40',
    error || field?.invalid
      ? 'border-[var(--destructive)] focus-visible:ring-[var(--destructive)]'
      : 'border-[var(--border)] focus-visible:border-[var(--ring)]',
    className
  )}
  {...rest}
/>
