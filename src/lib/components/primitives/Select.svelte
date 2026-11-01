<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { formFieldContext, type FormFieldContext } from '$lib/utils/form-field.js';

  interface Props {
    value?: string;
    disabled?: boolean;
    id?: string;
    class?: string;
    error?: boolean;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'false' | 'true';
    children?: Snippet;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    disabled = false,
    id,
    class: className = '',
    error = false,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    children,
    onchange,
  }: Props = $props();
  const field = getContext<FormFieldContext | undefined>(formFieldContext);
</script>

<div class={cn('relative w-full', className)}>
  <select
    id={id ?? field?.controlId}
    aria-describedby={ariaDescribedby ?? field?.descriptionId}
    aria-invalid={ariaInvalid ?? (field?.invalid ? 'true' : undefined)}
    {disabled}
    bind:value
    onchange={(e) => onchange?.((e.target as HTMLSelectElement).value)}
    class={cn(
      'flex h-9 w-full appearance-none rounded-[var(--radius)] border bg-transparent px-3 py-1 pr-8 text-sm',
      'text-[var(--foreground)]',
      'transition-colors duration-[150ms]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-0',
      'cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
      error || field?.invalid
        ? 'border-[var(--destructive)] focus-visible:ring-[var(--destructive)]'
        : 'border-[var(--border)] focus-visible:border-[var(--ring)]'
    )}
  >
    {#if children}{@render children()}{/if}
  </select>
  <!-- Chevron icon -->
  <div class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</div>
