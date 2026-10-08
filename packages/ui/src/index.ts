import { ProficiencyLevel } from '@skillgap/types';

export function getScoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  badge: string;
  ring: string;
} {
  if (score >= 80) {
    return {
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
      ring: 'stroke-emerald-600',
    };
  }
  if (score >= 65) {
    return {
      text: 'text-brand-700 dark:text-brand-400',
      bg: 'bg-brand-50 dark:bg-brand-950/40',
      border: 'border-brand-200 dark:border-brand-800',
      badge: 'bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-brand-300',
      ring: 'stroke-brand-600',
    };
  }
  if (score >= 50) {
    return {
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
      ring: 'stroke-amber-600',
    };
  }
  return {
    text: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
    ring: 'stroke-rose-600',
  };
}

export function getProficiencyBadgeClass(level: ProficiencyLevel): string {
  switch (level) {
    case 'expert':
      return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-300 border-secondary-200';
    case 'advanced':
      return 'bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300 border-brand-200';
    case 'intermediate':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200';
    case 'elementary':
      return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200';
    case 'beginner':
    default:
      return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200';
  }
}
