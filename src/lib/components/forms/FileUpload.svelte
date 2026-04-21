<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    maxSize?: number;
    class?: string;
    onfiles?: (files: File[]) => void;
  }

  let {
    accept,
    multiple = false,
    disabled = false,
    maxSize,
    class: className = '',
    onfiles,
  }: Props = $props();

  let dragging = $state(false);
  let inputEl = $state<HTMLInputElement | null>(null);
  let error = $state('');

  function processFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    if (maxSize) {
      const oversized = files.find(f => f.size > maxSize);
      if (oversized) {
        error = `${oversized.name} exceeds the ${(maxSize / 1024 / 1024).toFixed(0)} MB limit.`;
        return;
      }
    }
    error = '';
    onfiles?.(files);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    if (!disabled) processFiles(e.dataTransfer?.files ?? null);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (!disabled) dragging = true;
  }
</script>

<div
  role="button"
  tabindex={disabled ? -1 : 0}
  aria-label="Upload files"
  class={cn(
    'relative flex flex-col items-center justify-center gap-3',
    'rounded-[var(--radius)] border-2 border-dashed',
    'px-6 py-10 text-center transition-colors duration-[150ms]',
    dragging
      ? 'border-[var(--primary)] bg-[var(--primary)]/5'
      : 'border-[var(--border)] bg-transparent hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/40',
    disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
    className
  )}
  ondrop={handleDrop}
  ondragover={handleDragOver}
  ondragleave={() => { dragging = false; }}
  onclick={() => !disabled && inputEl?.click()}
  onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputEl?.click(); }}
>
  <input
    bind:this={inputEl}
    type="file"
    {accept}
    {multiple}
    {disabled}
    class="sr-only"
    onchange={(e) => processFiles((e.target as HTMLInputElement).files)}
  />

  <div class="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-[var(--muted)] text-[var(--muted-foreground)]">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  </div>

  <div>
    <p class="text-sm font-medium text-[var(--foreground)]">
      {dragging ? 'Drop to upload' : 'Drop files here or click to browse'}
    </p>
    {#if accept}
      <p class="mt-1 text-xs text-[var(--muted-foreground)]">{accept.split(',').join(', ')}</p>
    {/if}
    {#if maxSize}
      <p class="text-xs text-[var(--muted-foreground)]">Max {(maxSize / 1024 / 1024).toFixed(0)} MB</p>
    {/if}
  </div>

  {#if error}
    <p class="text-xs text-[var(--destructive)]">{error}</p>
  {/if}
</div>
