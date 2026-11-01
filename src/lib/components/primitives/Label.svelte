<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import { getContext } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { formFieldContext, type FormFieldContext } from '$lib/utils/form-field.js';

  interface Props extends HTMLLabelAttributes {
    class?: string;
    children?: Snippet;
    optional?: boolean;
  }

  let { class: className = '', children, for: htmlFor, optional = false, ...rest }: Props = $props();
  const field = getContext<FormFieldContext | undefined>(formFieldContext);
</script>

<label
  for={htmlFor ?? field?.controlId}
  class={cn(
    'flex items-center gap-1.5 text-xs font-medium text-[var(--foreground)] leading-none',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-45',
    className,
  )}
  {...rest}
>
  {#if children}{@render children()}{/if}
  {#if optional}
    <span class="font-normal text-[var(--subtle-foreground)]">Optional</span>
  {/if}
</label>
