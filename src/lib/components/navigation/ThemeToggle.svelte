<script lang="ts">
  import { cn } from '$lib/utils/cn.js';
  import { browser } from '$app/environment';

  type Theme = 'light' | 'dark' | 'system';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  function getInitialTheme(): Theme {
    if (!browser) return 'system';
    return (localStorage.getItem('olive-theme') as Theme) ?? 'system';
  }

  let theme = $state<Theme>(getInitialTheme());

  function applyTheme(value: Theme) {
    if (!browser) return;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', value === 'dark' || (value === 'system' && prefersDark));
    localStorage.setItem('olive-theme', value);
  }

  function cycle() {
    const next: Record<Theme, Theme> = { light: 'dark', dark: 'system', system: 'light' };
    theme = next[theme];
    applyTheme(theme);
  }

  $effect(() => {
    applyTheme(theme);
  });

  $effect(() => {
    if (!browser) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme('system');
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  });
</script>

<button
  type="button"
  onclick={cycle}
  aria-label="Change theme (current: {theme})"
  title="Theme: {theme}"
  class={cn(
    'group relative flex size-8 items-center justify-center rounded-[var(--radius-sm)]',
    'text-[var(--muted-foreground)] outline-none transition-colors',
    'hover:bg-[var(--accent)] hover:text-[var(--foreground)]',
    'focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
    className,
  )}
>
  <svg
    class={cn('absolute size-4 transition-[opacity,transform] duration-[var(--duration-fast)]', theme === 'light' ? 'scale-100 opacity-100' : 'scale-75 opacity-0')}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
  <svg
    class={cn('absolute size-4 transition-[opacity,transform] duration-[var(--duration-fast)]', theme === 'dark' ? 'scale-100 opacity-100' : 'scale-75 opacity-0')}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
  <svg
    class={cn('absolute size-4 transition-[opacity,transform] duration-[var(--duration-fast)]', theme === 'system' ? 'scale-100 opacity-100' : 'scale-75 opacity-0')}
    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
  >
    <rect x="2.5" y="3.5" width="19" height="13" rx="2" /><path d="M8 20.5h8M12 16.5v4" />
  </svg>
</button>
