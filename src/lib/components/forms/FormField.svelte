<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn.js';
  import { setContext } from 'svelte';
  import { formFieldContext, type FormFieldContext } from '$lib/utils/form-field.js';

  interface Props {
    name?: string;
    error?: string;
    hint?: string;
    class?: string;
    children?: Snippet;
  }

  let { name = '', error = '', hint = '', class: className = '', children }: Props = $props();
  const fieldId = $props.id();
  const controlId = `${fieldId}-control`;
  const descriptionId = `${fieldId}-description`;

  setContext<FormFieldContext>(formFieldContext, {
    get controlId() { return controlId; },
    get descriptionId() { return error || hint ? descriptionId : undefined; },
    get invalid() { return !!error; },
  });
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
  {#if children}{@render children()}{/if}
  {#if error}
    <p id={descriptionId} role="alert" class="text-xs text-[var(--destructive)]">{error}</p>
  {:else if hint}
    <p id={descriptionId} class="text-xs text-[var(--muted-foreground)]">{hint}</p>
  {/if}
</div>
