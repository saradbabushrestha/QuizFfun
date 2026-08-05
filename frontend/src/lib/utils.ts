import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const DIFFICULTY_COLORS = {
  easy: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
  medium: 'text-warning-400 bg-warning-500/10 border-warning-500/20',
  hard: 'text-danger-400 bg-danger-500/10 border-danger-500/20',
} as const;

export const STATUS_COLORS = {
  draft: 'text-surface-500 bg-surface-500/10 border-surface-500/20',
  published: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
  archived: 'text-warning-400 bg-warning-500/10 border-warning-500/20',
  active: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
  completed: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
} as const;
