import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatPhoneNumber, truncateText } from '../formatters';

describe('Format Utilities', () => {
  describe('formatCurrency', () => {
    it('formats currency with default locale', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('handles undefined and null values', () => {
      expect(formatCurrency(undefined as any)).toBe('N/A');
      expect(formatCurrency(null as any)).toBe('N/A');
    });
  });

  describe('formatDate', () => {
    it('formats date with default format', () => {
      expect(formatDate('2024-03-15')).toBe('Mar 15, 2024');
      expect(formatDate('2024-01-01')).toBe('Jan 1, 2024');
    });

    it('handles invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Invalid date');
    });

    it('handles empty or undefined dates', () => {
      expect(formatDate('')).toBe('N/A');
      expect(formatDate(undefined as any)).toBe('N/A');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats 10-digit phone numbers', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567');
    });

    it('formats 11-digit phone numbers starting with 1', () => {
      expect(formatPhoneNumber('15551234567')).toBe('+1 (555) 123-4567');
    });

    it('handles empty or undefined phone numbers', () => {
      expect(formatPhoneNumber('')).toBe('N/A');
      expect(formatPhoneNumber(undefined as any)).toBe('N/A');
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than max length', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a...');
    });

    it('returns original text if shorter than max length', () => {
      expect(truncateText('Short text', 20)).toBe('Short text');
    });

    it('handles empty text', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });
}); 