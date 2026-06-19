/**
 * Utils unit tests
 * Tests for all utility functions in src/lib/utils.ts
 */

import { describe, it, expect } from 'vitest';
import {
  cn,
  formatCurrency,
  formatNumber,
  formatDate,
  slugify,
  truncate,
  debounce,
  clamp,
  lerp,
  mapRange,
  isBrowser,
  generateId,
  sanitizePhone,
  buildWhatsAppUrl,
} from '@/lib/utils';

describe('cn — class name utility', () => {
  it('merges classes correctly', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8');
  });

  it('handles undefined/null gracefully', () => {
    expect(cn('base', undefined, null as unknown as string)).toBe('base');
  });
});

describe('formatCurrency', () => {
  it('formats INR correctly', () => {
    const result = formatCurrency(50000);
    expect(result).toContain('50,000');
    expect(result).toContain('₹');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toContain('0');
  });

  it('handles large numbers (lakhs)', () => {
    const result = formatCurrency(150000);
    expect(result).toContain('1,50,000');
  });
});

describe('formatNumber', () => {
  it('formats with Indian locale', () => {
    expect(formatNumber(100000)).toBe('1,00,000');
  });

  it('handles small numbers', () => {
    expect(formatNumber(42)).toBe('42');
  });
});

describe('slugify', () => {
  it('converts to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Solar Panel @ ₹40,000!')).toBe('solar-panel-40000');
  });

  it('handles multiple spaces/dashes', () => {
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles Hindi text (keeps alphanumeric)', () => {
    expect(slugify('solar-energy')).toBe('solar-energy');
  });
});

describe('truncate', () => {
  it('does not truncate short strings', () => {
    expect(truncate('Short', 100)).toBe('Short');
  });

  it('truncates long strings with ellipsis', () => {
    const result = truncate('This is a very long string', 10);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(13); // 10 + '...'
  });

  it('handles exact boundary', () => {
    expect(truncate('Exactly ten', 11)).toBe('Exactly ten');
  });
});

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('lerp', () => {
  it('returns start at factor 0', () => {
    expect(lerp(0, 100, 0)).toBe(0);
  });

  it('returns end at factor 1', () => {
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it('returns midpoint at factor 0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });
});

describe('mapRange', () => {
  it('maps value from one range to another', () => {
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
  });

  it('maps min boundary', () => {
    expect(mapRange(0, 0, 10, 0, 100)).toBe(0);
  });

  it('maps max boundary', () => {
    expect(mapRange(10, 0, 10, 0, 100)).toBe(100);
  });
});

describe('sanitizePhone', () => {
  it('removes non-digit characters', () => {
    expect(sanitizePhone('+91 98765-43210')).toBe('919876543210');
  });

  it('handles already clean number', () => {
    expect(sanitizePhone('9876543210')).toBe('9876543210');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds basic URL', () => {
    expect(buildWhatsAppUrl('9876543210')).toBe('https://wa.me/9876543210');
  });

  it('includes encoded message', () => {
    const url = buildWhatsAppUrl('9876543210', 'Hello Solar');
    expect(url).toContain('text=Hello%20Solar');
  });

  it('strips non-digits from phone', () => {
    expect(buildWhatsAppUrl('+91-9876543210')).toBe('https://wa.me/919876543210');
  });
});

describe('isBrowser', () => {
  it('returns true in jsdom environment', () => {
    expect(isBrowser).toBe(true);
  });
});

describe('generateId', () => {
  it('generates unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('uses provided prefix', () => {
    const id = generateId('lead');
    expect(id.startsWith('lead-')).toBe(true);
  });
});
