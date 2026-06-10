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

  function applyTheme(t: Theme) {
    if (!browser) return;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = t === 'dark' || (t === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('olive-theme', t);
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
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') applyTheme('system'); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });
</script>

<button
  type="button"
  onclick={cycle}
  aria-label="Toggle theme (current: {theme})"
  title="Toggle theme"
  class={cn(
    'relative flex h-8 w-8 items-center justify-center rounded-[var(--radius)]',
    'cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]',
    'transition-all duration-[150ms]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
    className
  )}
>
  <!-- Sun icon -->
  <svg
    class={cn('absolute transition-all duration-[200ms]', theme === 'light' ? 'opacity-100 scale-100' : 'opacity-0 scale-75')}
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
  <!-- Moon icon -->
  <svg
    class={cn('absolute transition-all duration-[200ms]', theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-75')}
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
  <!-- System/monitor icon -->
  <svg
    class={cn('absolute transition-all duration-[200ms]', theme === 'system' ? 'opacity-100 scale-100' : 'opacity-0 scale-75')}
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
  </svg>
</button>
