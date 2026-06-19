/**
 * Leads Service — Unit Tests
 * Tests for submitLead() and getLeads() server-side service
 */

import { describe, it, expect, vi } from 'vitest';
import { submitLead, getLeads } from '../leads';
import type { ContactFormData } from '@/types/common';

// ── Fixtures ──────────────────────────────────────────────────────────────────
const mockLead: ContactFormData = {
  name: 'Priya Sharma',
  phone: '7890123456',
  email: 'priya@solar.in',
  city: 'Pune',
  electricityBill: 12000,
  message: 'Interested in rooftop solar for my home.',
};

// ── submitLead ─────────────────────────────────────────────────────────────────
describe('services/leads — submitLead()', () => {
  it('returns success:true with a generated lead id', async () => {
    const result = await submitLead(mockLead);
    expect(result.success).toBe(true);
    expect(result.data?.id).toBeTruthy();
    expect(typeof result.data?.id).toBe('string');
    expect(result.error).toBeNull();
  });

  it('lead id starts with "lead-"', async () => {
    const result = await submitLead(mockLead);
    expect(result.data?.id.startsWith('lead-')).toBe(true);
  });

  it('returns a success message', async () => {
    const result = await submitLead(mockLead);
    expect(result.message).toBeTruthy();
  });

  it('handles thrown errors gracefully', async () => {
    // Force the service to throw by spying on console.warn
    const warnSpy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {
      throw new Error('Unexpected failure');
    });

    const result = await submitLead(mockLead);

    // Should still return a result — success depends on implementation
    // Key: no unhandled rejection
    expect(result).toBeDefined();
    expect(typeof result.success).toBe('boolean');

    warnSpy.mockRestore();
  });
});

// ── getLeads ──────────────────────────────────────────────────────────────────
describe('services/leads — getLeads()', () => {
  it('returns success:true', async () => {
    const result = await getLeads();
    expect(result.success).toBe(true);
  });

  it('returns an array for data', async () => {
    const result = await getLeads();
    expect(Array.isArray(result.data)).toBe(true);
  });

  it('returns null error on success', async () => {
    const result = await getLeads();
    expect(result.error).toBeNull();
  });
});
