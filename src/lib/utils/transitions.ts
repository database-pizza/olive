import { cubicOut } from 'svelte/easing';
import { prefersReducedMotion } from 'svelte/motion';
import type { TransitionConfig } from 'svelte/transition';

interface PopOptions {
  y?: number;
  duration?: number;
  scale?: number;
}

/**
 * Opacity + a short lift + a whisper of scale. Used for surfaces that float
 * above the page (dialogs, popovers, menus).
 */
export function popIn(node: Element, options: PopOptions = {}): TransitionConfig {
  const { y = 8, duration = 240, scale = 0.985 } = options;
  const d = prefersReducedMotion.current ? 0 : duration;
  return {
    duration: d,
    easing: cubicOut,
    css: (t) =>
      `opacity:${t};transform:translate3d(0,${(1 - t) * y}px,0) scale(${scale + (1 - scale) * t});`,
  };
}

export function popOut(node: Element, options: PopOptions = {}): TransitionConfig {
  const { y = 6, duration = 150, scale = 0.99 } = options;
  const d = prefersReducedMotion.current ? 0 : duration;
  return {
    duration: d,
    easing: cubicOut,
    css: (t) =>
      `opacity:${t};transform:translate3d(0,${(1 - t) * y}px,0) scale(${scale + (1 - scale) * t});`,
  };
}

/**
 * Dialogs become a bottom sheet on phones and a centred card on larger
 * screens. The transition picks the right gesture for the viewport.
 */
export function surfaceIn(node: Element, options: { duration?: number } = {}): TransitionConfig {
  const duration = options.duration ?? 280;
  if (prefersReducedMotion.current) return { duration: 0, css: () => '' };

  const isPhone = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;
  if (isPhone) {
    return {
      duration,
      easing: cubicOut,
      css: (t) => `opacity:${t};transform:translate3d(0,${(1 - t) * 24}px,0);`,
    };
  }
  return {
    duration,
    easing: cubicOut,
    css: (t) => `opacity:${t};transform:translate3d(0,${(1 - t) * 10}px,0) scale(${0.985 + 0.015 * t});`,
  };
}

export function surfaceOut(node: Element, options: { duration?: number } = {}): TransitionConfig {
  const duration = options.duration ?? 170;
  if (prefersReducedMotion.current) return { duration: 0, css: () => '' };

  const isPhone = typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;
  if (isPhone) {
    return {
      duration,
      easing: cubicOut,
      css: (t) => `opacity:${t};transform:translate3d(0,${(1 - t) * 24}px,0);`,
    };
  }
  return {
    duration,
    easing: cubicOut,
    css: (t) => `opacity:${t};transform:translate3d(0,${(1 - t) * 8}px,0) scale(${0.99 + 0.01 * t});`,
  };
}

export function drawerIn(node: Element, options: { side?: 'left' | 'right'; duration?: number } = {}): TransitionConfig {
  const { side = 'left', duration = 280 } = options;
  if (prefersReducedMotion.current) return { duration: 0, css: () => '' };
  const sign = side === 'left' ? -1 : 1;
  return {
    duration,
    easing: cubicOut,
    css: (t) => `transform:translate3d(${(1 - t) * sign * 100}%,0,0);`,
  };
}

export function drawerOut(node: Element, options: { side?: 'left' | 'right'; duration?: number } = {}): TransitionConfig {
  const { side = 'left', duration = 180 } = options;
  if (prefersReducedMotion.current) return { duration: 0, css: () => '' };
  const sign = side === 'left' ? -1 : 1;
  return {
    duration,
    easing: cubicOut,
    css: (t) => `transform:translate3d(${(1 - t) * sign * 100}%,0,0);`,
  };
}

/** A single element that grows in place, used by count chips and checks. */
export function bump(node: Element, options: { duration?: number } = {}): TransitionConfig {
  const duration = options.duration ?? 220;
  if (prefersReducedMotion.current) return { duration: 0, css: () => '' };
  return {
    duration,
    css: (t) => `transform:scale(${0.92 + 0.08 * t});opacity:${t};`,
  };
}

type Side = 'left' | 'right' | 'top' | 'bottom';

/** Sheets enter from their anchored edge. */
export function sheetIn(
  node: Element,
  options: { side?: Side; duration?: number } = {},
): TransitionConfig {
  const { side = 'right', duration = 280 } = options;
  if (prefersReducedMotion.current) return { duration: 0, css: () => '' };
  const axis = side === 'left' || side === 'right' ? 'X' : 'Y';
  const sign = side === 'left' || side === 'top' ? -1 : 1;
  return {
    duration,
    easing: cubicOut,
    css: (t) => `transform:translate3d(${axis === 'X' ? `${(1 - t) * sign * 100}%` : '0'},${axis === 'Y' ? `${(1 - t) * sign * 100}%` : '0'},0);`,
  };
}

export function sheetOut(
  node: Element,
  options: { side?: Side; duration?: number } = {},
): TransitionConfig {
  const { side = 'right', duration = 180 } = options;
  if (prefersReducedMotion.current) return { duration: 0, css: () => '' };
  const axis = side === 'left' || side === 'right' ? 'X' : 'Y';
  const sign = side === 'left' || side === 'top' ? -1 : 1;
  return {
    duration,
    easing: cubicOut,
    css: (t) => `transform:translate3d(${axis === 'X' ? `${(1 - t) * sign * 100}%` : '0'},${axis === 'Y' ? `${(1 - t) * sign * 100}%` : '0'},0);`,
  };
}
