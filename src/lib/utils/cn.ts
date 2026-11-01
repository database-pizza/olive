import { twMerge } from 'tailwind-merge';

type ClassValue = string | undefined | null | false | ClassValue[];

/**
 * Compose classes with Tailwind conflict resolution, so a caller's
 * `class="w-24"` beats a component's default `w-full`.
 */
export function cn(...classes: ClassValue[]): string {
  const merged = classes.flat(Infinity as 1).filter(Boolean).join(' ');
  return twMerge(merged);
}
