<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { formFieldContext, type FormFieldContext } from '$lib/utils/form-field.js';

  type Size = 'sm' | 'md' | 'lg';

  interface Props {
    value?: string;
    uiSize?: Size;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    id?: string;
    class?: string;
    error?: boolean;
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'false' | 'true';
    children?: Snippet;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    uiSize = 'md',
    disabled = false,
    required = false,
    name,
    id,
    class: className = '',
    error = false,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    children,
    onchange,
  }: Props = $props();

  const field = getContext<FormFieldContext | undefined>(formFieldContext);

  const sizes: Record<Size, string> = {
    sm: 'h-8 pl-2.5 pr-8 text-xs rounded-[var(--radius-sm)] sm:h-7',
    md: 'h-9 pl-3 pr-8 text-[13px] rounded-[var(--radius-button)] sm:h-8',
    lg: 'h-10 pl-3.5 pr-9 text-sm rounded-[var(--radius-control)]',
  };
</script>

<div class={cn('relative w-full', className)}>
  <select
    id={id ?? field?.controlId}
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedby ?? field?.descriptionId}
    aria-invalid={ariaInvalid ?? (field?.invalid ? 'true' : undefined)}
    {name}
    {required}
    {disabled}
    bind:value
    onchange={(event) => onchange?.((event.currentTarget as HTMLSelectElement).value)}
    class={cn(
      'flex w-full appearance-none border bg-[var(--card)] text-[var(--foreground)]',
      'shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)]',
      'outline-none transition-[border-color,box-shadow,background-color]',
      'duration-[var(--duration-fast)] ease-[var(--ease-move)]',
      'hover:border-[var(--border-strong)]',
      'focus:border-[var(--ring)] focus:ring-[3px] focus:ring-[color-mix(in_oklab,var(--ring)_18%,transparent)]',
      'disabled:cursor-not-allowed disabled:bg-[var(--muted)] disabled:opacity-60',
      sizes[uiSize],
      error || field?.invalid
        ? 'border-[color-mix(in_oklab,var(--destructive)_55%,transparent)]'
        : 'border-[var(--input)]',
    )}
  >
    {#if children}{@render children()}{/if}
  </select>
  <svg
    class="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--muted-foreground)]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
</div>
