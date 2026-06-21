import { generateId, now, formatDate, isOverdue, daysBetween } from '../src/utils';

describe('utils', () => {
  describe('generateId', () => {
    it('returns a 12-character hex string', () => {
      const id = generateId();
      expect(id).toMatch(/^[0-9a-f]{12}$/);
    });

    it('generates unique ids', () => {
      const ids = new Set(Array.from({ length: 100 }, generateId));
      expect(ids.size).toBe(100);
    });
  });

  describe('now', () => {
    it('returns a valid ISO date string', () => {
      const ts = now();
      expect(() => new Date(ts)).not.toThrow();
      expect(new Date(ts).toISOString()).toBe(ts);
    });
  });

  describe('formatDate', () => {
    it('formats ISO date as readable string', () => {
      const result = formatDate('2026-06-15T00:00:00.000Z');
      expect(result).toContain('2026');
      expect(result).toContain('Jun');
    });
  });

  describe('isOverdue', () => {
    it('returns true for a past date', () => {
      expect(isOverdue('2020-01-01')).toBe(true);
    });

    it('returns false for a future date', () => {
      expect(isOverdue('2099-01-01')).toBe(false);
    });
  });

  describe('daysBetween', () => {
    it('calculates positive difference correctly', () => {
      expect(daysBetween('2026-01-01', '2026-01-11')).toBe(10);
    });

    it('returns negative for reversed dates', () => {
      expect(daysBetween('2026-01-11', '2026-01-01')).toBe(-10);
    });

    it('returns 0 for same date', () => {
      expect(daysBetween('2026-06-01', '2026-06-01')).toBe(0);
    });
  });
});
