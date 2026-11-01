<script lang="ts">
  import { cn } from '$lib/utils/cn.js';

  interface Props {
    password: string;
    minLength?: number;
    class?: string;
    showHints?: boolean;
  }

  let { password, minLength = 12, class: className = '', showHints = true }: Props = $props();

  let checks = $derived.by(() => {
    const value = password ?? '';
    return {
      length: value.length >= minLength,
      long: value.length >= 16,
      mixedCase: /[a-z]/.test(value) && /[A-Z]/.test(value),
      number: /\d/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value),
      noRepeat: !/(.)\1{2,}/.test(value),
      noSequence: !/(012|123|234|345|456|567|678|789|abc|bcd|cde|qwe|asd|zxc)/i.test(value),
    };
  });

  let score = $derived.by(() => {
    if (!password) return 0;
    let points = 0;
    if (checks.length) points++;
    if (checks.long) points++;
    if (checks.mixedCase) points++;
    if (checks.number) points++;
    if (checks.symbol) points++;
    if (!checks.noRepeat) points--;
    if (!checks.noSequence) points--;
    if (points <= 1) return 1;
    if (points === 2) return 2;
    if (points === 3) return 3;
    return 4;
  });

  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = [
    'bg-[var(--muted)]',
    'bg-[var(--destructive)]',
    'bg-[var(--warning)]',
    'bg-[var(--info)]',
    'bg-[var(--success)]',
  ];

  let hints = $derived(
    [
      !checks.length && `At least ${minLength} characters`,
      !checks.mixedCase && 'Mix upper and lower case',
      !checks.number && 'Add a number',
      !checks.symbol && 'Add a symbol',
      !checks.noRepeat && 'Avoid repeated characters',
      !checks.noSequence && 'Avoid sequences like 123 or abc',
    ].filter(Boolean) as string[],
  );
</script>

<div class={cn('flex flex-col gap-1.5', className)}>
  {#if password}
  <div class="flex items-center gap-2">
    <div class="flex flex-1 gap-1" aria-hidden="true">
      {#each [1, 2, 3, 4] as segment}
        <span
          class={cn(
            'h-1 flex-1 rounded-full transition-colors',
            password && score >= segment ? colors[score] : 'bg-[var(--muted)]',
          )}
        ></span>
      {/each}
    </div>
    <span class="w-16 text-right text-[11px] text-[var(--muted-foreground)]" aria-live="polite">
      {password ? labels[score] : ''}
    </span>
  </div>
  {/if}
  {#if showHints && hints.length > 0 && password}
    <ul class="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--muted-foreground)]">
      {#each hints.slice(0, 3) as hint}
        <li>{hint}</li>
      {/each}
    </ul>
  {/if}
</div>
