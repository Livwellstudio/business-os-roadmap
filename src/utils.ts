import { randomBytes } from 'crypto';

export function generateId(): string {
  return randomBytes(6).toString('hex');
}

export function now(): string {
  return new Date().toISOString();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function isOverdue(targetDate: string): boolean {
  return new Date(targetDate) < new Date();
}

export function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}
