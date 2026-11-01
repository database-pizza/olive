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
    get controlId() {
      return controlId;
    },
    get descriptionId() {
      return error || hint ? descriptionId : undefined;
    },
    get invalid() {
      return !!error;
    },
  });
</script>

<div class={cn('flex flex-col gap-1.5', className)} data-name={name || undefined}>
  {#if children}{@render children()}{/if}
  {#if error}
    <p id={descriptionId} role="alert" class="flex items-center gap-1 text-xs text-[var(--destructive-foreground-soft)]">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" />
      </svg>
      {error}
    </p>
  {:else if hint}
    <p id={descriptionId} class="text-xs leading-relaxed text-[var(--muted-foreground)]">{hint}</p>
  {/if}
</div>
